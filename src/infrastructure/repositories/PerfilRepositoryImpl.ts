import { Perfil } from "../../domain/entities/Perfil";
import { PerfilId } from "../../domain/value-objects/PerfilId";
import { PerfilRepository } from "../../domain/repositories/PerfilRepository";

export class PerfilRepositoryImpl implements PerfilRepository {
    private perfiles: Map<string, Perfil> = new Map();

    async save(perfil: Perfil): Promise<void> {
        this.perfiles.set(perfil.id.value, perfil);
    }

    async findById(id: PerfilId): Promise<Perfil | null> {
        return this.perfiles.get(id.value) || null;
    }

    async update(perfil: Perfil): Promise<void> {
        if (!this.perfiles.has(perfil.id.value)) {
            throw new Error("Perfil no encontrado");
        }
        this.perfiles.set(perfil.id.value, perfil);
    }

    async delete(id: PerfilId): Promise<void> {
        if (!this.perfiles.has(id.value)) {
            throw new Error("Perfil no encontrado");
        }
        this.perfiles.delete(id.value);
    }

    // Método para testing
    getAllPerfiles(): Perfil[] {
        return Array.from(this.perfiles.values());
    }

    clearAll(): void {
        this.perfiles.clear();
    }
}
