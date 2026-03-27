import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';

export interface IProductoEstadisticasRepository {
  save(
    productoEstadisticas: ProductoEstadisticas,
  ): Promise<ProductoEstadisticas>;

  findByProductoId(
    productoId: ProductoId,
  ): Promise<ProductoEstadisticas | null>;

  findMasVendidos(limit: number): Promise<ProductoEstadisticas[]>;
}
