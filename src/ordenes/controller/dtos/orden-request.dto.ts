import { ItemOrden } from '@ordenes/domain/entities/item-orden.entity';
import { IsString } from 'class-validator';

export class OrdenRequestDto {
  @IsString({ message: 'El id de cliente debe ser una cadena de texto' })
  clienteId!: string;

  items!: ItemOrden;
  //   productoId: string;
  //   nombreProducto: string;
  //   sku: string;
  //   cantidad: number;
  //   precioUnitario: number; ???

  direccion!: object;
  // nombreDEstinatario: string,
  // calle: string,
  // ciudad: string,
  // estado. string,
  //   codigoPostal: string
  //   pais: string
  //   telefono: string
  //   instrucciones: string

  pago!: object;
  //   metodoPago: string;
  //   estado: string;
  //   referenciaExterna: string;
}
