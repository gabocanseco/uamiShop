import { IsNotEmpty, IsUUID } from 'class-validator';

export class ProductoParamDto {
  @IsNotEmpty({ message: 'El id del producto es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  id!: string;
}
