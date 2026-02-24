import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEmail } from 'class-validator';

export class CarritoParamDto {
  @ApiProperty({
    description: 'ID único del carrito',
    example: '550e8400-e29b-41d4-a716-446655440010',
    format: 'uuid',
  })
  @IsNotEmpty({ message: 'El parametro id del carrito es obligatorio' })
  @IsUUID('4', {
    message: 'El parametro id del carrito debe ser un UUID válido versión 4',
  })
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    required: true,
    example: 'f79d6f9e-65c7-4f01-851d-af9be6bce3ab',
    description: 'Identificador UUID del carrito',
  })
  id!: string;
}
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
