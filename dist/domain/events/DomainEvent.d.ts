export declare abstract class DomainEvent {
    readonly eventId: string;
    readonly occurredAt: Date;
    readonly eventType: string;
    constructor();
    abstract getAggregateId(): string;
}
//# sourceMappingURL=DomainEvent.d.ts.map