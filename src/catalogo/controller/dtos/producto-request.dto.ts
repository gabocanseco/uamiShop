import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class ProductoRequestDto {
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, {
    message: 'El nombre del producto debe tener minimo 3 caracteres',
  })
  @MaxLength(100, {
    message: 'El nombre del producto debe tener máximo 100 caracteres',
  })
  nombre!: string; // con ! le decimos que el valor será asignado después

  @IsNotEmpty({ message: 'La descripción del producto es obligatoria' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, {
    message: 'La descripcion del producto debe tener máximo 500 caracteres',
  })
  descripcion!: string;

  @IsNotEmpty({ message: 'El precio del producto es obligatorio' })
  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a cero' })
  precio!: number;

  @IsNotEmpty({ message: 'La categoría del producto es obligatoria' })
  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  categoriaId!: string;
}
