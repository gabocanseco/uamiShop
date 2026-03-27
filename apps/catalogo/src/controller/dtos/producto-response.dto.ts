import { ApiProperty } from '@nestjs/swagger';
export class ProductoResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '550e8400-e29b-41d4-a716-446655440020',
    format: 'uuid',
  })
  id!: string;
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Camiseta de algodón',
  })
  nombre!: string;
  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Camiseta de algodón 100% con diseño exclusivo',
  })
  descripcion!: string;

  @ApiProperty({
    description: 'Precio del producto con moneda',
    example: [
      {
        cantidad: 3.99,
        moneda: 'USD',
      },
    ],
  })
  precio!: object;

  @ApiProperty({
    description: 'ID de la categoría a la que pertenece el producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  categoriaId!: string;
  @ApiProperty({
    description: 'Indica si el producto está disponible para la venta',
    example: true,
  })
  disponible!: boolean;
  @ApiProperty({
    description: 'Fecha de creación del producto',
    example: '2024-06-01T12:00:00Z',
    format: 'date-time',
  })
  fechaCreacion!: Date;
  @ApiProperty({
    isArray: true,
    description: 'Lista de imágenes del producto',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        url: 'https://example.com/imagenes/camiseta-algodon.jpg',
        alt: 'Camiseta de algodón',
        orden: 1,
      },
    ],
  })
  imagenes!: {
    id: string;
    url: string;
    alt: string;
    orden: number;
  }[];
}
