import { Usuario } from "../entities/Usuario";
import { UserId } from "../value-objects/UserId";
import { Email } from "../value-objects/Email";
export interface UsuarioRepository {
    save(usuario: Usuario): Promise<void>;
    findById(id: UserId): Promise<Usuario | null>;
    findByEmail(email: Email): Promise<Usuario | null>;
    update(usuario: Usuario): Promise<void>;
    delete(id: UserId): Promise<void>;
}
//# sourceMappingURL=UsuarioRepository.d.ts.map