import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { IProductoEstadisticasRepository } from './interfaces/producto-estadisticas.repository';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';

export class ProductoEstadisticasInMemoryRepository implements IProductoEstadisticasRepository {
  private productoEstadisticas: Map<string, ProductoEstadisticas>;

  constructor() {
    this.productoEstadisticas = new Map();
  }

  async save(
    productoEstadisticas: ProductoEstadisticas,
  ): Promise<ProductoEstadisticas> {
    this.productoEstadisticas.set(
      productoEstadisticas.getProductoId().getValue(),
      productoEstadisticas,
    );
    return productoEstadisticas;
  }

  async findByProductoId(
    productoId: ProductoId,
  ): Promise<ProductoEstadisticas | null> {
    return this.productoEstadisticas.get(productoId.getValue()) || null;
  }

  async findMasVendidos(limit: number): Promise<ProductoEstadisticas[]> {
    const estadisticas = Array.from(this.productoEstadisticas.values());
    return estadisticas
      .sort((a, b) => b.getVentasTotales() - a.getVentasTotales())
      .slice(0, limit);
  }
}
