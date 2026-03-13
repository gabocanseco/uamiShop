import { Money } from '@shared/domain/value-objects/money.vo';
import { ItemOrdenId } from '@ordenes/domain/value-objects/ids/item-orden-id.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

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

  public getId(): ItemOrdenId {
    return this.id;
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
  public getCantidad(): number {
    return this.cantidad;
  }
  public getPrecioUnitario(): Money {
    return this.precioUnitario;
  }
  public getSubtotal(): Money {
    return this.subtotal;
  }

  static reconstruct(props: {
    id: ItemOrdenId;
    productoId: ProductoId;
    nombreProducto: string;
    sku: string;
    cantidad: number;
    precioUnitario: Money;
    subtotal: Money;
  }): ItemOrden {
    return new ItemOrden(
      props.id,
      props.productoId,
      props.nombreProducto,
      props.sku,
      props.cantidad,
      props.precioUnitario,
      props.subtotal,
    );
  }

  public toPrimitives() {
    return {
      id: this.id.getValue(),
      productoId: this.productoId.getValue(),
      nombreProducto: this.nombreProducto,
      sku: this.sku,
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario.toPrimitives(),
      subtotal: this.subtotal.toPrimitives(),
    };
  }
}
