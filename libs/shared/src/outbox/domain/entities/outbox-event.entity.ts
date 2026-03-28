import { OutboxEventId } from '@app/shared/outbox/domain/value-objects/ids/outbox-event-id.vo';
import { OutboxStatus } from '@app/shared/outbox/domain/enums/outbox-status.enum';

export class OutboxEvent<T = any> {
  private constructor(
    private readonly id: OutboxEventId,
    private aggregateType: string, // Ejemplo: 'Orden'
    private aggregateId: string, // El ID de la entidad agregada, por ejemplo, el ID de la orden
    private eventType: string, // Ejemplo: 'orden.creada'
    private exchangeName: string, // El nombre del exchange de RabbitMQ al que se enviará el mensaje
    private routingKey: string, // La routing key para RabbitMQ, por ejemplo, 'orden.creada'
    private payload: T, // El contenido del mensaje
    private occurredAt: Date, // La fecha y hora en que ocurrió el evento
    private status: OutboxStatus,
    private attempCount: number,
    private nextAttemptAt?: Date,
    private lastError?: string,
    private sentAt?: Date,
  ) {}

  static pending<T>(
    agreggateType: string,
    agreggateId: string,
    eventType: string,
    exchangeName: string,
    routingKey: string,
    payload: T,
  ): OutboxEvent<T> {
    const event = new OutboxEvent(
      OutboxEventId.generar(),
      agreggateType,
      agreggateId,
      eventType,
      exchangeName,
      routingKey,
      payload,
      new Date(),
      OutboxStatus.PENDING,
      0,
    );
    return event;
  }

  public markSent() {
    this.status = OutboxStatus.SENT;
    this.sentAt = new Date();
  }

  public markFailed(errorMessage: string) {
    this.status = OutboxStatus.FAILED;
    this.lastError = errorMessage;
    this.attempCount += 1;
    const backoffTime = Math.min(60, Math.pow(2, this.attempCount)) * 1000; // Backoff exponencial con un máximo de 60 segundos
    this.nextAttemptAt = new Date(Date.now() + backoffTime);
  }

  public incrementAttempt() {
    this.attempCount += 1;
    const backoffTime = Math.min(60, Math.pow(2, this.attempCount)) * 1000;
    this.nextAttemptAt = new Date(Date.now() + backoffTime);
  }

  public getId(): OutboxEventId {
    return this.id;
  }

  public getAggregateType(): string {
    return this.aggregateType;
  }

  public getAggregateId(): string {
    return this.aggregateId;
  }

  public getEventType(): string {
    return this.eventType;
  }
  public getExchangeName(): string {
    return this.exchangeName;
  }
  public getRoutingKey(): string {
    return this.routingKey;
  }
  public getPayload(): T {
    return this.payload;
  }
  public getOcurredAt(): Date {
    return this.occurredAt;
  }
  public getStatus(): OutboxStatus {
    return this.status;
  }
  public getAttempCount(): number {
    return this.attempCount;
  }
  public getNextAttemptAt(): Date | undefined {
    return this.nextAttemptAt;
  }
  public getLastError(): string | undefined {
    return this.lastError;
  }
  public getSentAt(): Date | undefined {
    return this.sentAt;
  }

  static reconstruct<T = any>(props: {
    id: OutboxEventId;
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    exchangeName: string;
    routingKey: string;
    payload: T;
    ocurredAt: Date;
    status: OutboxStatus;
    attempCount: number;
    nextAttemptAt?: Date;
    lastError?: string;
    sentAt?: Date;
  }): OutboxEvent {
    const event = new OutboxEvent(
      props.id,
      props.aggregateType,
      props.aggregateId,
      props.eventType,
      props.exchangeName,
      props.routingKey,
      props.payload,
      props.ocurredAt,
      props.status,
      props.attempCount,
      props.nextAttemptAt,
      props.lastError,
      props.sentAt,
    );
    return event;
  }
}
