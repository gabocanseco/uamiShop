import { Direccion } from "../value-objects/Direccion";
import { Telefono } from "../value-objects/Telefono";
import { PerfilId } from "../value-objects/PerfilId";
import { DomainEvent } from "../events/DomainEvent";
export declare class Perfil {
    readonly id: PerfilId;
    readonly nombre: string;
    readonly apellidoPat: string;
    readonly apellidoMat: string;
    readonly fechaNacimiento: Date;
    readonly telefono: Telefono;
    readonly direccion: Direccion;
    private domainEvents;
    constructor(id: PerfilId, nombre: string, apellidoPat: string, apellidoMat: string, fechaNacimiento: Date, telefono: Telefono, direccion: Direccion);
    private addDomainEvent;
    getDomainEvents(): DomainEvent[];
    clearDomainEvents(): void;
}
//# sourceMappingURL=Perfil.d.ts.map