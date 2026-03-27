import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductoRequestDto {
  @ApiProperty({
    description:
      'Nombre del producto (Requerido). Limitantes: Mínimo 3 caracteres, Máximo 100 caracteres',
    example: 'Camiseta de algodón',
    minLength: 3,
    maxLength: 100,
    required: true,
  })
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, {
    message: 'El nombre del producto debe tener minimo 3 caracteres',
  })
  @MaxLength(100, {
    message: 'El nombre del producto debe tener máximo 100 caracteres',
  })
  nombre!: string; // con ! le decimos que el valor será asignado después

  @ApiProperty({
    description:
      'Descripción del producto (Requerido). Limitantes: Máximo 500 caracteres. Proporciona detalles sobre características, material, uso, etc.',
    example:
      'Camiseta de algodón 100% orgánico, cómoda y durable. Disponible en múltiples colores.',
    maxLength: 500,
    required: true,
  })
  @IsNotEmpty({ message: 'La descripción del producto es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, {
    message: 'La descripcion del producto debe tener máximo 500 caracteres',
  })
  descripcion!: string;

  @ApiProperty({
    description:
      'Precio del producto en MXN. Limitantes: Debe ser mayor a 0. Ej: 19.99, 100.00',
    example: 29.99,
    type: Number,
    minimum: 0,
    required: true,
  })
  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a cero' })
  precio!: number;

  @ApiProperty({
    description:
      'ID de la categoría a la que pertenece el producto (UUID válido formato v4) (Requerido). Esto vincula el producto con una categoría existente.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'La categoría del producto es obligatoria' })
  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  categoriaId!: string;
}
