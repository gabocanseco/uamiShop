/**
 * Evento emitido cuando se crea una nueva orden en el sistema.
 */
export class OrdenCreadaEvent {
    constructor(
        readonly eventId: string,
        readonly occurredAt: Date,
        readonly ordenId: string,
        readonly carritoId: string,
        readonly clienteId: string,
    ) { }
}
