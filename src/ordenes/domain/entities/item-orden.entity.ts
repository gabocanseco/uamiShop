import { Money } from '@shared/domain/value-objects/money.vo';
import { ItemOrdenId } from '@ordenes/domain/value-objects/ids/item-orden-id.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id';

export class ItemOrden {
  private constructor(
    private id: ItemOrdenId,
    private productoId: ProductoId,
    private nombreProducto: string,
    private sku: string,
    private cantidad: number,
    private precioUnitario: Money,
    private subtotal: Money,
  ) {}

  public static crear(
    productoId: ProductoId,
    nombreProducto: string,
    sku: string,
    cantidad: number,
    precioUnitario: Money,
  ): ItemOrden {
    const subtotal = precioUnitario.multiplicar(cantidad);
    return new ItemOrden(
      ItemOrdenId.generar(),
      productoId,
      nombreProducto,
      sku,
      cantidad,
      precioUnitario,
      subtotal,
    );
  }

  public calcularSubtotal(): Money {
    const nuevoSubtotal = this.precioUnitario.multiplicar(this.cantidad);
    this.subtotal = nuevoSubtotal;
    return nuevoSubtotal;
  }
}
