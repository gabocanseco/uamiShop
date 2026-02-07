import { DomainEvent } from "./DomainEvent";

export class UsuarioCreado extends DomainEvent {
    constructor(
        public readonly usuarioId: string,
        public readonly email: string
    ) {
        super();
    }

    getAggregateId(): string {
        return this.usuarioId;
    }
}
