import { IsNotEmpty, IsUUID } from 'class-validator';

export class ClienteParamDto {
  @IsNotEmpty({ message: 'El id de cliente es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  id!: string;
}
