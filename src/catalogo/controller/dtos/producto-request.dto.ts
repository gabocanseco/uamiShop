import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class ProductoRequestDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, {
    message: 'El nombre del producto debe tener minimo 3 caracteres',
  })
  @MaxLength(3, {
    message: 'El nombre del producto debe tener máximo 100 caracteres',
  })
  nombre!: string; // con ! le decimos que el valor será asignado después

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(500, {
    message: 'La descripcion del producto debe tener máximo 500 caracteres',
  })
  descripcion!: string;

  @IsNumber()
  @IsPositive({ message: 'El precio debe ser mayor a cero' })
  precio!: number;

  @IsString({ message: 'La categoría debe ser una cadena de texto' })
  categoria!: string;
}
