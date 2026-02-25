import { IsNotEmpty } from 'class-validator';
import { ItemCarritoResumenDto } from './item-carrito-resumen.dto';

export class CarritoResumenDto {
  // readonly carritoId: string;
  readonly clienteId!: string;
  readonly items!: ItemCarritoResumenDto[];
}
