import { IsString } from 'class-validator';

export class CategoriaRequestDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre!: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion!: string;

  @IsString({
    message: 'EL id de categoria padre debe ser una cadena de texto',
  })
  categoriaPadreId?: string;
}
