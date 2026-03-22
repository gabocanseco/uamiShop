import { ApiProperty } from '@nestjs/swagger';
import { CarritoParamDto } from '@shared/controller/dtos/carrito-params.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CarritoProductoParamsDto extends CarritoParamDto {
  @ApiProperty({
    description: 'ID único del producto a agregar al carrito',
    example: '550e8400-e29b-41d4-a716-446655440020',
    format: 'uuid',
  })
  @IsNotEmpty({
    message: 'El parametro producttoId del producto es obligatorio',
  })
  @IsUUID('4', {
    message:
      'El parametro productoId del producto debe ser un UUID válido versión 4',
  })
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    required: true,
    example: 'f79d6f9e-65c7-4f01-851d-af9be6bce3ab',
    description: 'Identificador UUID del producto',
  })
  productoId!: string;
}