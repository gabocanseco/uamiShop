import { OutboxEvent } from '@app/shared/outbox/domain/entities/outbox-event.entity';
import { OutboxStatus } from '@app/shared/outbox/domain/enums/outbox-status.enum';

export interface IOutboxEventRepository {
  save(event: OutboxEvent): Promise<void>;
  findTop50StatusInAndAttemptAtLessThanEqualOrderByOcurredAtAsc(
    status: OutboxStatus[],
    nextAttemptAt: Date,
  ): Promise<OutboxEvent[]>;
  update(event: OutboxEvent): Promise<void>;
}
