import { IsNotEmpty, IsUUID } from 'class-validator';

export class CategoriaParamDto {
  @IsNotEmpty({ message: 'El id de la categoria es obligatorio' })
  @IsUUID('4', {
    message: 'El Id de la categoria  debe ser un UUID válido versión 4',
  })
  id!: string;
}
