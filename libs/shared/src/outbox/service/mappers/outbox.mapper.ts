import { OutboxEvent } from '@app/shared/outbox/domain/entities/outbox-event.entity';
import { OutboxOrmEntity } from '@app/shared/outbox/infrastructure/persistance/entities/outbox-orm.entity';
import { OutboxEventId } from '@app/shared/outbox/domain/value-objects/ids/outbox-event-id.vo';

export class OutboxEventMapper {
  static outboxOrmToDomain(outboxOrm: OutboxOrmEntity): OutboxEvent {
    return OutboxEvent.reconstruct({
      id: OutboxEventId.of(outboxOrm.id),
      aggregateType: outboxOrm.aggregateType,
      aggregateId: outboxOrm.aggregateId,
      eventType: outboxOrm.eventType,
      exchangeName: outboxOrm.exchangeName,
      routingKey: outboxOrm.routingKey,
      payload: JSON.parse(outboxOrm.payload),
      ocurredAt: new Date(outboxOrm.occurredAt),
      status: outboxOrm.status,
      attempCount: outboxOrm.attempCount,
      nextAttemptAt: outboxOrm.nextAttemptAt
        ? new Date(outboxOrm.nextAttemptAt)
        : undefined,
      lastError: outboxOrm.lastError,
      sentAt: outboxOrm.sentAt ? new Date(outboxOrm.sentAt) : undefined,
    });
  }

  static outboxEventToPersistance(event: OutboxEvent) {
    const outboxOrm = new OutboxOrmEntity();
    outboxOrm.id = event.getId().getValue();
    outboxOrm.aggregateType = event.getAggregateType();
    outboxOrm.aggregateId = event.getAggregateId();
    outboxOrm.eventType = event.getEventType();
    outboxOrm.exchangeName = event.getExchangeName();
    outboxOrm.routingKey = event.getRoutingKey();
    outboxOrm.payload = JSON.stringify(event.getPayload());
    outboxOrm.occurredAt = event.getOcurredAt();
    outboxOrm.status = event.getStatus();
    outboxOrm.attempCount = event.getAttempCount();
    outboxOrm.nextAttemptAt = event.getNextAttemptAt();
    outboxOrm.lastError = event.getLastError();
    outboxOrm.sentAt = event.getSentAt();
    return outboxOrm;
  }
}
