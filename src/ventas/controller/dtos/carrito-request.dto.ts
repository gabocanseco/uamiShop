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
  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantidad!: number;
}

export class ProductoRefDto {
  @IsNotEmpty({ message: 'El id del producto es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  productoId!: string;

  @IsString({ message: 'El nombre de producto debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de producto es obligatorio' })
  nombreProducto!: string;

  @IsString({ message: 'El sku debe ser una cadena' })
  @IsNotEmpty({ message: 'El sku es obligatorio' })
  sku!: string;
}

export class CarritoRequestDto {
  @ValidateNested()
  @Type(() => ProductoRefDto)
  productoRef!: ProductoRefDto;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantidad!: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'El precio es obligatorioi' })
  precioUnitario!: number;
}

// export class CarritoRequestDto {
//   clienteId!: string;
//   lineas!: {
//     productoId: string;
//     cantidad: number;
//     precioUnitario: number;
//     moneda?: string;
//   }[];
//   descuento?: {
//     porcentaje?: number;
//     monto?: number;
//     moneda?: string;
//   };
//   impuesto?: {
//     porcentaje: number;
//     monto?: number;
//     moneda?: string;
//   };
//   referenciaPago?: string;
//   notas?: string;
// }

// export class AgregarProductoDto {
//   productoId!: string;
//   nombreProducto!: string;
//   sku?: string;
//   cantidad!: number;
//   precioUnitario!: number;
//   moneda?: string;
// }
