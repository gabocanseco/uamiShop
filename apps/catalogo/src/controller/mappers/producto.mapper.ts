import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoRequestDto } from '../dtos/producto-request.dto';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Money } from '@app/shared/domain/value-objects/money.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { plainToInstance } from 'class-transformer';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { ProductoResponseDto } from '../dtos/producto-response.dto';

export class ProductoMapper {
  static toDomainId(id: string) {
    return ProductoId.of(id);
  }

  static toDomain(productoRequestDto: ProductoRequestDto): Producto {
    const nombreProducto = NombreProducto.crear(productoRequestDto.nombre);
    const descripcionProducto = DescripcionProducto.crear(
      productoRequestDto.descripcion,
    );
    const precio = Money.crear(productoRequestDto.precio);
    const categoriaId = CategoriaId.of(productoRequestDto.categoriaId);

    return Producto.crear(
      nombreProducto,
      descripcionProducto,
      precio,
      categoriaId,
    );
  }

  static toResponseDto(producto: Producto): ProductoResponseDto {
    return plainToInstance(ProductoResponseDto, producto.toPrimitives());
  }
}
