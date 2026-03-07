export class ProductoAgregadoAlCarritoEvent {
  constructor(
    readonly eventId: string,
    readonly occurredAt: Date,
    readonly productoId: string,
    readonly carritoId: string,
    readonly cantidad: number,
    readonly precioUnitario: number,
    readonly moneda: string,
  ) {}
}
