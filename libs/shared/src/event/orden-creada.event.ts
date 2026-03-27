/**
 * Evento emitido cuando se crea una nueva orden en el sistema.
 */
export class OrdenCreadaEvent {
  constructor(
    readonly eventId: string,
    readonly occurredAt: string,
    readonly ordenId: string,
    readonly clienteId: string,
    readonly carritoId?: string,
  ) {}
}
