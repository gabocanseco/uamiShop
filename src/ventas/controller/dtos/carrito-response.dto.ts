import { ApiProperty } from '@nestjs/swagger';
export class CarritoResponseDto {
  @ApiProperty({
    description: 'ID único del carrito',
    example: '550e8400-e29b-41d4-a716-446655440010',
    format: 'uuid',
  })
  id!: string;
  @ApiProperty({
    description: 'ID del cliente propietario del carrito',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  clienteId!: string;
  @ApiProperty({
    description: 'Lista de productos en el carrito',
    example: [
      {
        productoId: '550e8400-e29b-41d4-a716-446655440020',
        nombreProducto: 'Camiseta de algodón',
        sku: 'CAM-ALG-001',
        cantidad: 2,
        precioUnitario: 19.99,
      },
    ],
  })
  items!: object[];
  @ApiProperty({
    description: 'Descuentos aplicados al carrito',
    example: [
      {
        cantidad: 3.99,
        moneda: 'USD',
      },
    ],
  })
  descuentos!: object[];
  @ApiProperty({
    description: 'Estado actual del carrito',
    example: 'activo',
  })
  estado!: string;
  @ApiProperty({
    description: 'Fecha de creación del carrito',
    example: '2024-06-01T12:00:00Z',
    format: 'date-time',
  })
  fechaCreacion!: Date;
  @ApiProperty({
    description: 'Fecha de última actualización del carrito',
    example: '2024-06-02T15:30:00Z',
    format: 'date-time',
  })
  fechaActualizacion!: Date;
}
