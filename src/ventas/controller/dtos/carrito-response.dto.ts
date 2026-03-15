import { ApiProperty } from '@nestjs/swagger';
export class CarritoResponseDto {
  @ApiProperty({
    description: 'ID único del carrito',
    example: '550e8400-e29b-41d4-a716-446655440010',
    format: 'uuid',
  })
  id!: string;
  clienteId!: string;
  items!: object[];
  descuentos!: object[];
  estado!: string;
  fechaCreacion!: Date;
  fechaActualizacion!: Date;
}
