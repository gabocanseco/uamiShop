import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoRequestDto } from '../dtos/producto-request.dto';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { ProductoResponseDto } from '../dtos/producto-response.dto';

export class ProductoMapper {
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
    const productoPrimitives = producto.toPrimitives();
    const productoResponseDto = new ProductoResponseDto();
    productoResponseDto.id = productoPrimitives.id;
    productoResponseDto.nombre = productoPrimitives.nombre;
    productoResponseDto.descripcion = productoPrimitives.descripcion;
    productoResponseDto.precio = productoPrimitives.precio;
    productoResponseDto.categoriaId = productoPrimitives.categoriaId;
    productoResponseDto.disponible = productoPrimitives.disponible;
    productoResponseDto.fechaCreacion = productoPrimitives.fechaCreacion;
    return productoResponseDto;
  }
}
