import { Inject, Injectable } from '@nestjs/common';
import { OUTBOX_REPOSITORY } from '../domain/constants';
import type { IOutboxEventRepository } from '../domain/interfaces/outbox-event.repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OutboxEvent } from '../domain/entities/outbox-event.entity';
import { OutboxStatus } from '../domain/enums/outbox-status.enum';

@Injectable()
export class OutboxPublisherService {
  private readonly maxRetries: number = 3; // Número máximo de reintentos para publicar un evento
  i;
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepository: IOutboxEventRepository,
    private readonly amqpConnection: AmqpConnection, // Conexión a RabbitMQ para publicar eventos (Advanced Message Queuing Protocol)
  ) {}

  async publishPendingEvents() {
    const pendingEvents =
      await this.outboxRepository.findTop50StatusInAndAttemptAtLessThanEqualOrderByOcurredAtAsc(
        [OutboxStatus.PENDING, OutboxStatus.FAILED],
        new Date(),
      );

    if (pendingEvents.length === 0) {
      return; // No hay eventos pendientes para publicar
    }

    // Filtrar eventos que han superado el número máximo de reintentos
    const eventsToPublish = pendingEvents.filter(
      (event) => event.getAttempCount() < this.maxRetries,
    );

    await Promise.all(
      eventsToPublish.map(async (event) => {
        await this.publishEvent(event);
      }),
    );
  }

  private async publishEvent(event: OutboxEvent) {
    try {
      const rawPayload = event.getPayload();
      let finalPayload;

      // 🛡️ DOBLE VALIDACIÓN: Si es un string (que viene de la DB), lo parseamos.
      // Si ya es un objeto (porque el Mapper lo parseó), lo usamos directo.
      if (typeof rawPayload === 'string') {
        finalPayload = JSON.parse(rawPayload);
      } else {
        finalPayload = rawPayload;
      }

      // Si por alguna razón sigue siendo string (doble serialización), parseamos otra vez
      if (typeof finalPayload === 'string') {
        finalPayload = JSON.parse(finalPayload);
      }

      await this.amqpConnection.publish(
        event.getExchangeName(),
        event.getRoutingKey(),
        finalPayload,
      );
      event.markSent();
    } catch (error) {
      event.markFailed(error.message);
    } finally {
      await this.outboxRepository.update(event); // Actualizar el estado del evento en la base de datos después de intentar publicarlo
    }
  }
}
