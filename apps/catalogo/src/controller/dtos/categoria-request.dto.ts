import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoriaRequestDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónica',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre!: string;
  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Categoría que incluye todos los productos electrónicos',
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion!: string;

  @IsOptional()
  @ApiProperty({
    description: 'ID de la categoría padre (opcional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsString({
    message: 'EL id de categoria padre debe ser una cadena de texto',
  })
  categoriaPadreId?: string;
}
