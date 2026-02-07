"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioRepositoryImpl = void 0;
class UsuarioRepositoryImpl {
    constructor() {
        this.usuarios = new Map();
    }
    async save(usuario) {
        this.usuarios.set(usuario.id.value, usuario);
    }
    async findById(id) {
        return this.usuarios.get(id.value) || null;
    }
    async findByEmail(email) {
        for (const usuario of this.usuarios.values()) {
            if (usuario.email.equals(email)) {
                return usuario;
            }
        }
        return null;
    }
    async update(usuario) {
        if (!this.usuarios.has(usuario.id.value)) {
            throw new Error("Usuario no encontrado");
        }
        this.usuarios.set(usuario.id.value, usuario);
    }
    async delete(id) {
        if (!this.usuarios.has(id.value)) {
            throw new Error("Usuario no encontrado");
        }
        this.usuarios.delete(id.value);
    }
    // Método para testing
    getAllUsuarios() {
        return Array.from(this.usuarios.values());
    }
    clearAll() {
        this.usuarios.clear();
    }
}
exports.UsuarioRepositoryImpl = UsuarioRepositoryImpl;
//# sourceMappingURL=UsuarioRepositoryImpl.js.map