/**
 * Define la información que serpa expuesta
 */
export class OrdenResponseDto {
  id!: string;
  numeroOrden!: string;
  clienteId!: string;
  items!: object[];
  direccionEnvio!: object;
  resumenPago!: object;
  subtotal!: object;
  descuento!: object;
  total!: object;
  estado!: string;
  fechaCreacion!: object;
  historialEstados!: object;
  infoEnvio?: object;
}
