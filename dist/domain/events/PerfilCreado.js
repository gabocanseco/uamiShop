"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilCreado = void 0;
const DomainEvent_1 = require("./DomainEvent");
class PerfilCreado extends DomainEvent_1.DomainEvent {
    constructor(perfilId, nombre, apellidoPat, apellidoMat) {
        super();
        this.perfilId = perfilId;
        this.nombre = nombre;
        this.apellidoPat = apellidoPat;
        this.apellidoMat = apellidoMat;
    }
    getAggregateId() {
        return this.perfilId;
    }
}
exports.PerfilCreado = PerfilCreado;
//# sourceMappingURL=PerfilCreado.js.map