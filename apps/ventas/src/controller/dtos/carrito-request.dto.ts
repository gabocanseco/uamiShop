import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class CantidadDto {
  @ApiProperty({
    description: 'Cantidad del producto a agregar al carrito',
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantidad!: number;
}

export class ProductoRefDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '550e8400-e29b-41d4-a716-446655440020',
    format: 'uuid',
    required: true,
  })
  @IsNotEmpty({ message: 'El id del producto es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  productoId!: string;
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Camiseta de algodón',
    required: true,
  })
  @IsString({ message: 'El nombre de producto debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de producto es obligatorio' })
  nombreProducto!: string;
  @ApiProperty({
    description: 'SKU del producto (Stock Keeping Unit)',
    example: 'CAM-ALG-001',
    required: true,
  })
  @IsString({ message: 'El sku debe ser una cadena' })
  @IsNotEmpty({ message: 'El sku es obligatorio' })
  sku!: string;
}

export class CarritoRequestDto {
  @ValidateNested()
  @ApiProperty({
    description: 'Referencia al producto a agregar al carrito',
    type: ProductoRefDto,
    required: true,
  })
  @Type(() => ProductoRefDto)
  productoRef!: ProductoRefDto;
  @ApiProperty({
    description: 'Cantidad del producto a agregar al carrito',
    example: 2,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantidad!: number;
  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 19.99,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'El precio es obligatorioi' })
  precioUnitario!: number;
}
