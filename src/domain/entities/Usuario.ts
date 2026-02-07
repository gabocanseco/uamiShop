import { UserId } from "../value-objects/UserId";
import { Email } from "../value-objects/Email";
import { DomainEvent } from "../events/DomainEvent";
import { UsuarioCreado } from "../events/UsuarioCreado";

export class Usuario {
    private domainEvents: DomainEvent[] = [];

    constructor(
        public readonly id: UserId,
        public readonly email: Email,
        private passwordHash: string
    ) {
        if (!passwordHash) throw new Error("Se requiere una contraseña");
        this.passwordHash = passwordHash;
        
        // Emitir evento de creación
        this.addDomainEvent(new UsuarioCreado(id.value, email.value));
    }

    cambiarContrasena(newHash: string) {
        if (!newHash) throw new Error("Contraseña inválida");
        this.passwordHash = newHash;
    }

    getPasswordHash(): string {
        return this.passwordHash;
    }

    private addDomainEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }

    getDomainEvents(): DomainEvent[] {
        return this.domainEvents;
    }

    clearDomainEvents(): void {
        this.domainEvents = [];
    }
}
