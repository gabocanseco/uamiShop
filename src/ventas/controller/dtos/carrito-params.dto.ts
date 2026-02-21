import { IsNotEmpty, IsUUID } from 'class-validator';

export class CarritoParamDto {
  @IsNotEmpty({ message: 'El parametro id del carrito es obligatorio' })
  @IsUUID('4', {
    message: 'El parametro id del carrito debe ser un UUID válido versión 4',
  })
  id!: string;
}
export class CarritoProductoParamsDto extends CarritoParamDto {
  @IsNotEmpty({
    message: 'El parametro producttoId del producto es obligatorio',
  })
  @IsUUID('4', {
    message:
      'El parametro productoId del producto debe ser un UUID válido versión 4',
  })
  productoId!: string;
}
