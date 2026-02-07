import { DomainEvent } from "./DomainEvent";

export class PerfilCreado extends DomainEvent {
    constructor(
        public readonly perfilId: string,
        public readonly nombre: string,
        public readonly apellidoPat: string,
        public readonly apellidoMat: string
    ) {
        super();
    }

    getAggregateId(): string {
        return this.perfilId;
    }
}
