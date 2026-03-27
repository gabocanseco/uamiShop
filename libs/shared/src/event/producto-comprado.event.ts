/**
 * Evento cuando una orden se crea con items
 */
export class ProductoCompradoEvent {
  constructor(
    readonly eventId: string,
    readonly occurredAt: string,
    readonly ordenId: string,
    readonly clienteId: string,
    readonly items: ItemComprado[],
  ) {}
}

export class ItemComprado {
  constructor(
    readonly productoId: string,
    readonly sku: string,
    readonly cantidad: number,
    readonly precioUnitario: number,
    readonly moneda: string,
  ) {}
}
