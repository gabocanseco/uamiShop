import { IsNotEmpty, IsUUID } from 'class-validator';

export class OrdenParamsDto {
  @IsNotEmpty({ message: 'El id de la orden es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  id!: string;
}
