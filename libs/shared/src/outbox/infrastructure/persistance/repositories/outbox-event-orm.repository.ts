import { OutboxEvent } from '@app/shared/outbox/domain/entities/outbox-event.entity';
import { IOutboxEventRepository } from '@app/shared/outbox/domain/interfaces/outbox-event.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OutboxOrmEntity } from '../entities/outbox-orm.entity';
import { In, IsNull, LessThanOrEqual, Repository } from 'typeorm';
import { OutboxEventMapper } from '@app/shared/outbox/service/mappers/outbox.mapper';
import { OutboxStatus } from '@app/shared/outbox/domain/enums/outbox-status.enum';

@Injectable()
export class OutboxEventOrmRepository implements IOutboxEventRepository {
  constructor(
    @InjectRepository(OutboxOrmEntity)
    private readonly repository: Repository<OutboxOrmEntity>,
  ) {}
  async save(event: OutboxEvent): Promise<void> {
    const entity = OutboxEventMapper.outboxEventToPersistance(event);
    await this.repository.save(entity);
  }

  async findTop50StatusInAndAttemptAtLessThanEqualOrderByOcurredAtAsc(
    status: OutboxStatus[],
    nextAttemptAt: Date,
  ): Promise<OutboxEvent[]> {
    const entities = await this.repository.find({
      where: [
        { status: In(status), nextAttemptAt: LessThanOrEqual(nextAttemptAt) },
        { status: In(status), nextAttemptAt: IsNull() }, // Por si los nuevos no tienen fecha aún
      ],
      order: {
        occurredAt: 'ASC',
      },
      take: 50,
    });
    return entities.map((entity) =>
      OutboxEventMapper.outboxOrmToDomain(entity),
    );
  }

  async update(event: OutboxEvent): Promise<void> {
    const entity = OutboxEventMapper.outboxEventToPersistance(event);
    await this.repository.save(entity);
  }
}
