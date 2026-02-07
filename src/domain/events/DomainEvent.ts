import { v4 as uuid } from "uuid";

export abstract class DomainEvent {
    public readonly eventId: string;
    public readonly occurredAt: Date;
    public readonly eventType: string;

    constructor() {
        this.eventId = uuid();
        this.occurredAt = new Date();
        this.eventType = this.constructor.name;
    }

    abstract getAggregateId(): string;
}
