import { ApiProperty } from '@nestjs/swagger';
export class CategoriaResponseDto {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónica',
  })
  nombre!: string;
  @ApiProperty({
    description: 'Descripción de la categoría',
    example:
      'Categoría que incluye productos electrónicos como teléfonos, computadoras, etc.',
  })
  descripcion!: string;
  @ApiProperty({
    description: 'ID de la categoría padre (si existe)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    required: false,
  })
  categoriaPadreId?: string;
}
