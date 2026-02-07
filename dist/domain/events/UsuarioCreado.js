"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioCreado = void 0;
const DomainEvent_1 = require("./DomainEvent");
class UsuarioCreado extends DomainEvent_1.DomainEvent {
    constructor(usuarioId, email) {
        super();
        this.usuarioId = usuarioId;
        this.email = email;
    }
    getAggregateId() {
        return this.usuarioId;
    }
}
exports.UsuarioCreado = UsuarioCreado;
//# sourceMappingURL=UsuarioCreado.js.map