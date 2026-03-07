import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';

export interface IProductoEstadisticasRepository {
  save(
    productoEstadisticas: ProductoEstadisticas,
  ): Promise<ProductoEstadisticas>;

  findMasVendidos(limit: number): Promise<ProductoEstadisticas[]>;
}
