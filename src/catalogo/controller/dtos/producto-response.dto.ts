import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';

export class ProductoResponseDto {
  id!: string;
  nombre!: string;
  descripcion!: string;
  precio!: number;
  categoriaId!: string;
  nombreCategoria!: string;
  disponible!: boolean;

  public static fromDomain(producto: Producto): ProductoResponseDto {
    const productoPrimitivos = producto.toPrimitives();

    const response = new ProductoResponseDto();
    response.id = productoPrimitivos.id;
    response.nombre = productoPrimitivos.nombre;
    response.descripcion = productoPrimitivos.descripcion;
    response.precio = productoPrimitivos.precio;
    response.categoriaId = productoPrimitivos.categoriaId;
    response.disponible = productoPrimitivos.disponible;
    return response;
  }
}
