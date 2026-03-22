import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class OrdenParamDto {
  @IsNotEmpty({ message: 'El id de la orden es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  @ApiProperty({
    name: 'id',
    description: 'Identificador UUid de la orden',
    example: 'f79d6f9e-65c7-4f01-851d-af9be6bce3ab',
  })
  id!: string;
}
