export class ItemOrdenResumenDto {
  readonly productoId!: string;
  readonly nombreProducto!: string;
  readonly sku!: string;
  readonly cantidad!: number;
  readonly precioUnitario!: {
    cantidad: number;
    moneda: string;
  };
  readonly subtotal!: {
    cantidad: number;
    moneda: string;
  };
}
