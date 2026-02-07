import { DomainEvent } from "./DomainEvent";
export declare class PerfilCreado extends DomainEvent {
    readonly perfilId: string;
    readonly nombre: string;
    readonly apellidoPat: string;
    readonly apellidoMat: string;
    constructor(perfilId: string, nombre: string, apellidoPat: string, apellidoMat: string);
    getAggregateId(): string;
}
//# sourceMappingURL=PerfilCreado.d.ts.map