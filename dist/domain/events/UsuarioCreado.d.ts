import { DomainEvent } from "./DomainEvent";
export declare class UsuarioCreado extends DomainEvent {
    readonly usuarioId: string;
    readonly email: string;
    constructor(usuarioId: string, email: string);
    getAggregateId(): string;
}
//# sourceMappingURL=UsuarioCreado.d.ts.map