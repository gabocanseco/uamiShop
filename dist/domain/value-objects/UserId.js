"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserId = void 0;
const uuid_1 = require("uuid");
class UserId {
    constructor(value) {
        this.value = value;
        if (!value)
            throw new Error("UserId requerido");
        if (!this.isValidUUID(value)) {
            throw new Error("UserId inválido");
        }
    }
    static create() {
        return new UserId((0, uuid_1.v4)());
    }
    static from(value) {
        return new UserId(value);
    }
    isValidUUID(value) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }
    equals(other) {
        return this.value === other.value;
    }
    toString() {
        return this.value;
    }
}
exports.UserId = UserId;
//# sourceMappingURL=UserId.js.map