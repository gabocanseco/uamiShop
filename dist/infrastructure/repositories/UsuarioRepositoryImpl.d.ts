import { Usuario } from "../../domain/entities/Usuario";
import { UserId } from "../../domain/value-objects/UserId";
import { Email } from "../../domain/value-objects/Email";
import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";
export declare class UsuarioRepositoryImpl implements UsuarioRepository {
    private usuarios;
    save(usuario: Usuario): Promise<void>;
    findById(id: UserId): Promise<Usuario | null>;
    findByEmail(email: Email): Promise<Usuario | null>;
    update(usuario: Usuario): Promise<void>;
    delete(id: UserId): Promise<void>;
    getAllUsuarios(): Usuario[];
    clearAll(): void;
}
//# sourceMappingURL=UsuarioRepositoryImpl.d.ts.map