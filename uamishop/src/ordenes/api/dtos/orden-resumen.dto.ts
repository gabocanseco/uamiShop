import { ItemOrdenResumenDto } from './item-orden-resumen.dto';

export class OrdenResumenDto {
  readonly ordenId!: string;
  readonly numeroOrden!: string;
  readonly clienteId!: string;
  readonly items!: ItemOrdenResumenDto[];
  readonly subtotal!: {
    cantidad: number;
    moneda: string;
  };
  readonly descuento!: {
    cantidad: number;
    moneda: string;
  };
  readonly total!: {
    cantidad: number;
    moneda: string;
  };
  readonly estado!: string;
  readonly fechaCreacion!: Date;
}
