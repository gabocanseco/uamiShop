import { Carrito } from '@ventas/domain/agreggates/carrito.agreggate';
import { CarritoId } from '@app/shared/domain/value-objects/ids/carrito-id.vo';
import { CarritoResponseDto } from '../dtos/carrito-response.dto';
import { plainToInstance } from 'class-transformer';
import { ProductoRefDto } from '../dtos/carrito-request.dto';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';

export class CarritoMapper {
  static toDomainId(id: string) {
    return CarritoId.of(id);
  }

  /**
   * Convierte la entidad `Carrito` a un DTO de repuesta
   */
  static toResponseDto(carrito: Carrito): CarritoResponseDto {
    const primitives = carrito.toPrimitives();

    return plainToInstance(CarritoResponseDto, primitives);
  }
}

export class ProductoRefMapper {
  static toDomain(productoRefDto: ProductoRefDto): ProductoRef {
    const productoId = ProductoId.of(productoRefDto.productoId);

    const nombreProducto = productoRefDto.nombreProducto;

    const productoRef = ProductoRef.crear(
      productoId,
      nombreProducto,
      productoRefDto.sku,
    );

    return productoRef;
  }
}
