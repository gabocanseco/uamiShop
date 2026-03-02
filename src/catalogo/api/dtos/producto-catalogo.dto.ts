export class ProductoCatalogoDto {
  readonly productoId!: string;
  readonly nombre!: string;
  readonly precio!: {
    cantidad: number;
    moneda: string;
  };
  readonly disponible!: boolean;
}
