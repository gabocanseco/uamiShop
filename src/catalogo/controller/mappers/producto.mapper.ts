import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoRequestDto } from '../dtos/producto-request.dto';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { ProductoInfoDto } from '../../api/dtos/producto-info.dto';
import { plainToInstance } from 'class-transformer';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

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

  static toResponseDto(producto: Producto): ProductoInfoDto {
    return plainToInstance(ProductoInfoDto, producto.toPrimitives());
  }
}
