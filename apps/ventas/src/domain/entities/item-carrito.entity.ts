import { BusinessRuleException } from '@app/shared';
import { Money } from '@app/shared/domain/value-objects/money.vo';
import { ItemCarritoId } from '@ventas/domain/value-objects/ids/item-carrito-id.vo';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';

/**
 * Value Object que representa una línea de venta
 * @param cantidad - Cantidad del producto
 * @param precioUnitario - Precio unitario del producto
 */
export class ItemCarrito {
  private constructor(
    private Id: ItemCarritoId,
    private productoRef: ProductoRef,
    private cantidad: number,
    private precioUnitario: Money,
  ) {}

  public static crear(
    productoRef: ProductoRef,
    cantidad: number,
    precioUnitario: Money,
  ): ItemCarrito {
    ItemCarrito.verificaCantidad(cantidad);

    return new ItemCarrito(
      ItemCarritoId.generar(),
      productoRef,
      cantidad,
      precioUnitario,
    );
  }

  public static reconstruct(props: {
    id: ItemCarritoId;
    productoRef: ProductoRef;
    cantidad: number;
    precioUnitario: Money;
  }): ItemCarrito {
    return new ItemCarrito(
      props.id,
      props.productoRef,
      props.cantidad,
      props.precioUnitario,
    );
  }

  public actualizarCantidad(nuevaCantidad: number): void {
    ItemCarrito.verificaCantidad(nuevaCantidad);

    this.cantidad = nuevaCantidad;
  }

  public incrementarCantidad(cantidad: number): void {
    ItemCarrito.verificaCantidad(cantidad);

    this.cantidad = this.cantidad + cantidad;
  }

  public calcularSubtotal(): Money {
    return this.precioUnitario.multiplicar(this.cantidad);
  }

  public static verificaCantidad(cantidad: number): void {
    const CANTIDAD_MINIMA = 1;
    if (cantidad < CANTIDAD_MINIMA) {
      throw new BusinessRuleException(
        `La cantidad minima por producto es ${CANTIDAD_MINIMA}`,
      );
    }

    const CANTIDAD_MAXIMA = 10;
    if (cantidad > CANTIDAD_MAXIMA) {
      throw new BusinessRuleException(
        `La cantidad maxima por producto es ${CANTIDAD_MAXIMA}`,
      );
    }
  }

  public getId(): ItemCarritoId {
    return this.Id;
  }

  public getProductoRef(): ProductoRef {
    return this.productoRef;
  }

  public getCantidad(): number {
    return this.cantidad;
  }

  public getPrecioUnitario(): Money {
    return this.precioUnitario;
  }

  public toPrimitives() {
    return {
      id: this.Id.getValue(),
      productoRef: this.productoRef.toPrimitives(),
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario.toPrimitives(),
    };
  }
}
