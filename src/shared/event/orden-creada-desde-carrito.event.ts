/**
 * Evento emitido por Órdenes cuando se crea una orden a partir de un carrito.
 * Ventas lo escucha para marcar el carrito como COMPLETADO.
 */
export class OrdenCreadaDesdeCarritoEvent {
  constructor(
    readonly eventId: string,
    readonly occurredAt: Date,
    readonly ordenId: string,
    readonly carritoId: string,
  ) {}
}
