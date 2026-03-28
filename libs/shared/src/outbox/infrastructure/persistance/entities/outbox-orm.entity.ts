import { Column, Entity, PrimaryColumn } from 'typeorm';
import { OutboxStatus } from '../../../domain/enums/outbox-status.enum';

@Entity('outbox')
export class OutboxOrmEntity {
  @PrimaryColumn('varchar', { name: 'id', length: 36 })
  id!: string;

  @Column('varchar', { name: 'aggregate_type' })
  aggregateType!: string; // Ejemplo: 'Orden'

  @Column('varchar', { name: 'aggregate_id', length: 36 })
  aggregateId!: string; // El ID de la entidad agregada, por ejemplo, el ID de la orden

  @Column('varchar', { name: 'event_type' })
  eventType!: string; // Ejemplo: 'orden.creada'

  @Column('varchar', { name: 'exchange_name' })
  exchangeName!: string; // El nombre del exchange de RabbitMQ al que se enviará el mensaje

  @Column('varchar', { name: 'routing_key' })
  routingKey!: string; // La routing key para RabbitMQ, por ejemplo, 'orden.creada'

  @Column('text', { name: 'payload' })
  payload!: string; // El contenido del mensaje

  @Column('timestamp', { name: 'occurred_at' })
  occurredAt!: Date; // La fecha y hora en que ocurrió el evento

  @Column('enum', {
    name: 'status',
    enum: OutboxStatus,
    default: OutboxStatus.PENDING,
  })
  status!: OutboxStatus;

  @Column('int', { name: 'attemp_count', default: 0 })
  attempCount!: number;

  @Column('timestamp', { name: 'next_attempt_at', nullable: true })
  nextAttemptAt?: Date;

  @Column('varchar', { name: 'last_error', nullable: true })
  lastError?: string;

  @Column('timestamp', { name: 'sent_at', nullable: true })
  sentAt?: Date;
}
