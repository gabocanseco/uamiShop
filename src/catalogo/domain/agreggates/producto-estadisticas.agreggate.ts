import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

export class ProductoEstadisticas {
  private constructor(
    private readonly productoId: ProductoId,
    private ventasTotales: number, // número de transacciones (1 transaccion puede tener varias unidades vendidas)
    private cantidadVendida: number, // unidades vendidas
    private vecesAgregadAlCarrito: number,
    private ultimaVentaAt: DateTime,
    private ultimaAgregadoAlCarritoAt: DateTime,
  ) {}

  public static crear(productoId: ProductoId): ProductoEstadisticas {
    return new ProductoEstadisticas(
      productoId,
      0, // ventasTotales
      0, // cantidadVendida
      0, // vecesAgregadAlCarrito
      DateTime.now(), // ultimaVentaAt
      DateTime.now(), // ultimaAgregadoAlCarritoAt
    );
  }

  public incrementarVentas(cantidad: number): void {
    this.cantidadVendida += cantidad;
    this.ventasTotales += 1;
    this.ultimaVentaAt = DateTime.now();
  }

  public incrementarAgregadoAlCarrito(): void {
    this.vecesAgregadAlCarrito++;
    this.ultimaAgregadoAlCarritoAt = DateTime.now();
  }

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
