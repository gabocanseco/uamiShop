import { Inject, Injectable } from '@nestjs/common';
import type { IOutboxEventRepository } from '@app/shared/outbox/domain/interfaces/outbox-event.repository';
import { OUTBOX_REPOSITORY } from '@app/shared/outbox/domain/constants';
import { OutboxEvent } from '../domain/entities/outbox-event.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OutboxService {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepository: IOutboxEventRepository,
  ) {}

  @Transactional()
  async append<T>(
    aggregateType: string,
    aggregateId: string,
    eventType: string,
    exchangeName: string,
    routingKey: string,
    payload: T,
  ) {
    const event = OutboxEvent.pending(
      aggregateType,
      aggregateId,
      eventType,
      exchangeName,
      routingKey,
      payload,
    );
    await this.outboxRepository.save(event);
  }
}
