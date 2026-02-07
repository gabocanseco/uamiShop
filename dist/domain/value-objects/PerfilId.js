"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilId = void 0;
const uuid_1 = require("uuid");
class PerfilId {
    constructor(value) {
        this.value = value;
        if (!value)
            throw new Error("PerfilId requerido");
        if (!this.isValidUUID(value)) {
            throw new Error("PerfilId inválido");
        }
    }
    static create() {
        return new PerfilId((0, uuid_1.v4)());
    }
    static from(value) {
        return new PerfilId(value);
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
exports.PerfilId = PerfilId;
//# sourceMappingURL=PerfilId.js.map