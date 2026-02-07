"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilRepositoryImpl = void 0;
class PerfilRepositoryImpl {
    constructor() {
        this.perfiles = new Map();
    }
    async save(perfil) {
        this.perfiles.set(perfil.id.value, perfil);
    }
    async findById(id) {
        return this.perfiles.get(id.value) || null;
    }
    async update(perfil) {
        if (!this.perfiles.has(perfil.id.value)) {
            throw new Error("Perfil no encontrado");
        }
        this.perfiles.set(perfil.id.value, perfil);
    }
    async delete(id) {
        if (!this.perfiles.has(id.value)) {
            throw new Error("Perfil no encontrado");
        }
        this.perfiles.delete(id.value);
    }
    // Método para testing
    getAllPerfiles() {
        return Array.from(this.perfiles.values());
    }
    clearAll() {
        this.perfiles.clear();
    }
}
exports.PerfilRepositoryImpl = PerfilRepositoryImpl;
//# sourceMappingURL=PerfilRepositoryImpl.js.map