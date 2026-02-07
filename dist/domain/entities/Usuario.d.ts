import { UserId } from "../value-objects/UserId";
import { Email } from "../value-objects/Email";
import { DomainEvent } from "../events/DomainEvent";
export declare class Usuario {
    readonly id: UserId;
    readonly email: Email;
    private passwordHash;
    private domainEvents;
    constructor(id: UserId, email: Email, passwordHash: string);
    cambiarContrasena(newHash: string): void;
    getPasswordHash(): string;
    private addDomainEvent;
    getDomainEvents(): DomainEvent[];
    clearDomainEvents(): void;
}
//# sourceMappingURL=Usuario.d.ts.map