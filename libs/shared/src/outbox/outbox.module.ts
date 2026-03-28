import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxOrmEntity } from './infrastructure/persistance/entities/outbox-orm.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxPublisherService } from './service/outbox-publisher.service';
import { OutboxCronService } from './service/outbox-cron.service';
import { OUTBOX_REPOSITORY } from './domain/constants';
import { OutboxEventOrmRepository } from './infrastructure/persistance/repositories/outbox-event-orm.repository';
import { OutboxService } from './service/outbox.service';
import { SharedRabbitModule } from '../rabbitmq/rabbitmq.module';
import { EXCHANGES } from '../rabbitmq/constants/exchanges.const';

@Module({
  imports: [
    TypeOrmModule.forFeature([OutboxOrmEntity]), // Registra la tabla en el micro local
    SharedRabbitModule.register(EXCHANGES.UAMISHOP_EVENTS),
    ScheduleModule.forRoot(), // Habilita los Crons
  ],
  providers: [
    OutboxPublisherService,
    OutboxCronService,
    {
      provide: OUTBOX_REPOSITORY,
      useClass: OutboxEventOrmRepository,
    },
    // Si necesitas el OutboxService para guardar desde los servicios:
    OutboxService,
  ],
  exports: [OutboxService], // Exportamos lo que los servicios del micro usarán
})
export class OutboxModule {}
