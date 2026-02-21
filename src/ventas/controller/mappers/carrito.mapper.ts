import { Carrito } from '@ventas/domain/agreggates/carrito';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { CarritoResponseDto } from '../dtos/carrito-response.dto';
import { plainToInstance } from 'class-transformer';
import { ProductoRefDto } from '../dtos/carrito-request.dto';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';

export class CarritoMapper {
  static toDomainId(id: string) {
    return CarritoId.of(id);
  }

  static toResponseDto(carrito: Carrito): CarritoResponseDto {
    return plainToInstance(CarritoResponseDto, carrito.toPrimitives());
  }
}

export class ProductoRefMapper {
  static toDomain(productoRefDto: ProductoRefDto): ProductoRef {
    const productoId = ProductoId.of(productoRefDto.productoId);

    const nombreProducto = NombreProducto.crear(productoRefDto.nombreProducto);

    const productoRef = ProductoRef.crear(
      productoId,
      nombreProducto,
      productoRefDto.sku,
    );

    return productoRef;
  }
}
