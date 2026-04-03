import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CarritoService } from '@ventas/service/carrito.service';
import { CarritoId } from '@app/shared/domain/value-objects/ids/carrito-id.vo';
import { OrdenCreadaEvent } from '@app/shared/event/orden-creada.event';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGES } from '@app/shared/rabbitmq/constants/exchanges.const';
import { RK_ORDEN_CREADA } from '@app/shared/rabbitmq/constants/routing-keys.const';
import { QUEUE_VENTA_ORDEN_CREADA } from '@app/shared/rabbitmq/constants/queues.const';
import { Propagation, Transactional } from 'typeorm-transactional';

/**
 * Listener que marca el carrito como COMPLETADO
 * cuando recibe el evento OrdenCreadaEvent.
 */
@Injectable()
export class OrdenCreadaListener {
  private readonly logger = new Logger(OrdenCreadaListener.name);

  constructor(private readonly carritoService: CarritoService) {}

  @OnEvent('orden.creada', { async: true })
  @RabbitSubscribe({
    exchange: EXCHANGES.UAMISHOP_EVENTS, // Nombre del exchange
    routingKey: RK_ORDEN_CREADA, // Routing key para filtrar los mensajes
    queue: QUEUE_VENTA_ORDEN_CREADA, // Nombre de la cola donde se recibirán los mensajes
    errorHandler: (channel, msg, error) => {
      // Ack el mensaje aunque falle para evitar loop infinito de re-entrega
      channel.ack(msg);
    },
  })
  @Transactional({ propagation: Propagation.REQUIRES_NEW }) // Asegura que cada evento se maneje en una transacción separada
  async onOrdenCreada(event: OrdenCreadaEvent) {
    try {
      if (event.carritoId) {
        const carritoId = CarritoId.of(event.carritoId);
        await this.carritoService.completarCheckout(carritoId);
      }
    } catch (error) {
      // Log del error pero NO relanzamos para evitar re-entrega infinita
      this.logger.warn(
        `Error al procesar OrdenCreadaEvent (carritoId: ${event.carritoId}): ${error.message}`,
      );
    }
  }
}
