import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductoParamDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '550e8400-e29b-41d4-a716-446655440020',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'El id del producto es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  id!: string;
}
