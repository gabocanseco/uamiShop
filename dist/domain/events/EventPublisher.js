"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPublisher = void 0;
class EventPublisher {
    constructor() {
        this.handlers = new Map();
        this.events = [];
    }
    static getInstance() {
        if (!EventPublisher.instance) {
            EventPublisher.instance = new EventPublisher();
        }
        return EventPublisher.instance;
    }
    subscribe(eventType, handler) {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }
        this.handlers.get(eventType).push(handler);
    }
    async publish(event) {
        this.events.push(event);
        const handlers = this.handlers.get(event.eventType) || [];
        for (const handler of handlers) {
            await handler(event);
        }
    }
    getEvents() {
        return this.events;
    }
    clearEvents() {
        this.events = [];
    }
}
exports.EventPublisher = EventPublisher;
//# sourceMappingURL=EventPublisher.js.map