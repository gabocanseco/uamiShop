import { DomainEvent } from "./DomainEvent";
export type EventHandler = (event: DomainEvent) => Promise<void>;
export declare class EventPublisher {
    private static instance;
    private handlers;
    private events;
    private constructor();
    static getInstance(): EventPublisher;
    subscribe(eventType: string, handler: EventHandler): void;
    publish(event: DomainEvent): Promise<void>;
    getEvents(): DomainEvent[];
    clearEvents(): void;
}
//# sourceMappingURL=EventPublisher.d.ts.map