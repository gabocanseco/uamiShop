import { Injectable } from '@nestjs/common';
import { OutboxPublisherService } from './outbox-publisher.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OutboxCronService {
  constructor(
    private readonly outboxPublisherService: OutboxPublisherService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleOutboxEvents() {
    await this.outboxPublisherService.publishPendingEvents();
  }
}
