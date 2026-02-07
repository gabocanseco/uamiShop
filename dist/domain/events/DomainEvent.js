"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
const uuid_1 = require("uuid");
class DomainEvent {
    constructor() {
        this.eventId = (0, uuid_1.v4)();
        this.occurredAt = new Date();
        this.eventType = this.constructor.name;
    }
}
exports.DomainEvent = DomainEvent;
//# sourceMappingURL=DomainEvent.js.map