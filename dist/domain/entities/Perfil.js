"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Perfil = void 0;
const PerfilCreado_1 = require("../events/PerfilCreado");
class Perfil {
    constructor(id, nombre, apellidoPat, apellidoMat, fechaNacimiento, telefono, direccion) {
        this.id = id;
        this.nombre = nombre;
        this.apellidoPat = apellidoPat;
        this.apellidoMat = apellidoMat;
        this.fechaNacimiento = fechaNacimiento;
        this.telefono = telefono;
        this.direccion = direccion;
        this.domainEvents = [];
        if (!nombre)
            throw new Error("Nombre requerido");
        if (!apellidoPat)
            throw new Error("Apellido paterno requerido");
        if (!apellidoMat)
            throw new Error("Apellido materno requerido");
        if (!fechaNacimiento)
            throw new Error("Fecha de nacimiento requerida");
        // Emitir evento de creación
        this.addDomainEvent(new PerfilCreado_1.PerfilCreado(id.value, nombre, apellidoPat, apellidoMat));
    }
    addDomainEvent(event) {
        this.domainEvents.push(event);
    }
    getDomainEvents() {
        return this.domainEvents;
    }
    clearDomainEvents() {
        this.domainEvents = [];
    }
}
exports.Perfil = Perfil;
//# sourceMappingURL=Perfil.js.map