export class CarritoResponseDto {
  id!: string;
  clienteId!: string;
  items!: object[];
  descuentos!: object[];
  estado!: string;
  fechaCreacion!: Date;
  fechaActualizacion!: Date;
}
