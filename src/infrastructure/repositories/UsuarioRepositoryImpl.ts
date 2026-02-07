import { Usuario } from "../../domain/entities/Usuario";
import { UserId } from "../../domain/value-objects/UserId";
import { Email } from "../../domain/value-objects/Email";
import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";

export class UsuarioRepositoryImpl implements UsuarioRepository {
    private usuarios: Map<string, Usuario> = new Map();

    async save(usuario: Usuario): Promise<void> {
        this.usuarios.set(usuario.id.value, usuario);
    }

    async findById(id: UserId): Promise<Usuario | null> {
        return this.usuarios.get(id.value) || null;
    }

    async findByEmail(email: Email): Promise<Usuario | null> {
        for (const usuario of this.usuarios.values()) {
            if (usuario.email.equals(email)) {
                return usuario;
            }
        }
        return null;
    }

    async update(usuario: Usuario): Promise<void> {
        if (!this.usuarios.has(usuario.id.value)) {
            throw new Error("Usuario no encontrado");
        }
        this.usuarios.set(usuario.id.value, usuario);
    }

    async delete(id: UserId): Promise<void> {
        if (!this.usuarios.has(id.value)) {
            throw new Error("Usuario no encontrado");
        }
        this.usuarios.delete(id.value);
    }

    // Método para testing
    getAllUsuarios(): Usuario[] {
        return Array.from(this.usuarios.values());
    }

    clearAll(): void {
        this.usuarios.clear();
    }
}
