import { ProductoRefResumenDto } from './producto-ref-resumen.dto';

export class ItemCarritoResumenDto {
  readonly productoRef!: ProductoRefResumenDto;
  readonly cantidad!: number;
  readonly precioUnitario!: {
    cantidad: number;
    moneda: string;
  };
}
