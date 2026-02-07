"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const UsuarioCreado_1 = require("../events/UsuarioCreado");
class Usuario {
    constructor(id, email, passwordHash) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.domainEvents = [];
        if (!passwordHash)
            throw new Error("Se requiere una contraseña");
        this.passwordHash = passwordHash;
        // Emitir evento de creación
        this.addDomainEvent(new UsuarioCreado_1.UsuarioCreado(id.value, email.value));
    }
    cambiarContrasena(newHash) {
        if (!newHash)
            throw new Error("Contraseña inválida");
        this.passwordHash = newHash;
    }
    getPasswordHash() {
        return this.passwordHash;
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
exports.Usuario = Usuario;
//# sourceMappingURL=Usuario.js.map