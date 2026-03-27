import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';

export class ProductoRef {
  private constructor(
    private readonly productoId: ProductoId,
    private readonly nombreProducto: string,
    private readonly sku: string,
  ) {}

  public static crear(
    productoId: ProductoId,
    nombreProducto: string,
    sku: string,
  ): ProductoRef {
    return new ProductoRef(productoId, nombreProducto, sku);
  }

  public getProductoId(): ProductoId {
    return this.productoId;
  }

  public getNombreProducto(): string {
    return this.nombreProducto;
  }

  public getSku(): string {
    return this.sku;
  }

  public toPrimitives() {
    return {
      productoId: this.productoId.getValue(),
      nombreProducto: this.nombreProducto,
      sku: this.sku,
    };
  }
}
