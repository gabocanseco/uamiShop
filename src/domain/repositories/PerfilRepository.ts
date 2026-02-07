import { Perfil } from "../entities/Perfil";
import { PerfilId } from "../value-objects/PerfilId";

export interface PerfilRepository {
    save(perfil: Perfil): Promise<void>;
    findById(id: PerfilId): Promise<Perfil | null>;
    update(perfil: Perfil): Promise<void>;
    delete(id: PerfilId): Promise<void>;
}
