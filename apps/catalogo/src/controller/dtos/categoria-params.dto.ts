import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoriaParamDto {
  @ApiProperty({
    description: 'ID único de la categoría',
    example: '550e8400-e29b-41d4-a716-446655440030',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'El id de la categoria es obligatorio' })
  @IsUUID('4', {
    message: 'El Id de la categoria  debe ser un UUID válido versión 4',
  })
  id!: string;
}
