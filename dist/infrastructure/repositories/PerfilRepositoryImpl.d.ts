import { Perfil } from "../../domain/entities/Perfil";
import { PerfilId } from "../../domain/value-objects/PerfilId";
import { PerfilRepository } from "../../domain/repositories/PerfilRepository";
export declare class PerfilRepositoryImpl implements PerfilRepository {
    private perfiles;
    save(perfil: Perfil): Promise<void>;
    findById(id: PerfilId): Promise<Perfil | null>;
    update(perfil: Perfil): Promise<void>;
    delete(id: PerfilId): Promise<void>;
    getAllPerfiles(): Perfil[];
    clearAll(): void;
}
//# sourceMappingURL=PerfilRepositoryImpl.d.ts.map