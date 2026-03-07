import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';

export class ProductoEstadisticasInMemoryRepository {
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

  async findMasVendidos(limit: number): Promise<ProductoEstadisticas[]> {
    const estadisticas = Array.from(this.productoEstadisticas.values());
    return estadisticas
      .sort((a, b) => b.getVentasTotales() - a.getVentasTotales())
      .slice(0, limit);
  }
}
