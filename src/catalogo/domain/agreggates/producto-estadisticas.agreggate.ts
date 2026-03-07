import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

export class ProductoEstadisticas {
  constructor(
    private readonly productoId: ProductoId,
    private ventasTotales: number,
    private cantidadVendida: number,
    private vecesAgregadAlCarrito: number,
    private ultimaVentaAt: DateTime,
    private ultimaAgregadoAlCarritoAt: DateTime,
  ) {}

  // getters
  public getProductoId(): ProductoId {
    return this.productoId;
  }
  public getVentasTotales(): number {
    return this.ventasTotales;
  }
  public getCantidadVendida(): number {
    return this.cantidadVendida;
  }
  public getVecesAgregadAlCarrito(): number {
    return this.vecesAgregadAlCarrito;
  }
  public getUltimaVentaAt(): DateTime {
    return this.ultimaVentaAt;
  }
  public getUltimaAgregadoAlCarritoAt(): DateTime {
    return this.ultimaAgregadoAlCarritoAt;
  }
}
