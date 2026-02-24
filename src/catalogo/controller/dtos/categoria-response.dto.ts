import { ApiProperty } from '@nestjs/swagger';
export class CategoriaResponseDto {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;
  nombre!: string;
  descripcion!: string;
  categoriaPadreId?: string;
}
