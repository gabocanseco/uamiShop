import { Direccion } from "../value-objects/Direccion";
import { Telefono } from "../value-objects/Telefono";
import { PerfilId } from "../value-objects/PerfilId";
import { DomainEvent } from "../events/DomainEvent";
import { PerfilCreado } from "../events/PerfilCreado";

export class Perfil {
  private domainEvents: DomainEvent[] = [];

  constructor(
    public readonly id: PerfilId,
    public readonly nombre: string,
    public readonly apellidoPat: string,
    public readonly apellidoMat: string,
    public readonly fechaNacimiento: Date,
    public readonly telefono: Telefono,
    public readonly direccion: Direccion
  ) {
    if (!nombre) throw new Error("Nombre requerido");
    if (!apellidoPat) throw new Error("Apellido paterno requerido");
    if (!apellidoMat) throw new Error("Apellido materno requerido");
    if (!fechaNacimiento) throw new Error("Fecha de nacimiento requerida");

    // Emitir evento de creación
    this.addDomainEvent(new PerfilCreado(id.value, nombre, apellidoPat, apellidoMat));
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

