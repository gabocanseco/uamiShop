import { DomainEvent } from "./DomainEvent";

export type EventHandler = (event: DomainEvent) => Promise<void>;

export class EventPublisher {
    private static instance: EventPublisher;
    private handlers: Map<string, EventHandler[]> = new Map();
    private events: DomainEvent[] = [];

    private constructor() {}

    static getInstance(): EventPublisher {
        if (!EventPublisher.instance) {
            EventPublisher.instance = new EventPublisher();
        }
        return EventPublisher.instance;
    }

    subscribe(eventType: string, handler: EventHandler): void {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType)!.push(handler);
    }

    async publish(event: DomainEvent): Promise<void> {
        this.events.push(event);
        const handlers = this.handlers.get(event.eventType) || [];
        
        for (const handler of handlers) {
            await handler(event);
        }
    }

    getEvents(): DomainEvent[] {
        return this.events;
    }

    clearEvents(): void {
        this.events = [];
    }
}
