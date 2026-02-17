import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

export class ProductoRef {
  private constructor(
    private readonly productoId: ProductoId,
    private readonly nombreProducto: NombreProducto,
    private readonly sku: string,
  ) {}

  public static crear(
    productoId: ProductoId,
    nombreProducto: NombreProducto,
    sku: string,
  ): ProductoRef {
    return new ProductoRef(productoId, nombreProducto, sku);
  }

  public getProductoId(): ProductoId {
    return this.productoId;
  }

  public toPrimitives() {
    return {
      productoId: this.productoId.getValue(),
      nombreProducto: this.nombreProducto.getValue(),
      sku: this.sku,
    };
  }
}
