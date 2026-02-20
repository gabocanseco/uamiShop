import { Money } from '@shared/domain/value-objects/money.vo';
import { ItemCarritoId } from '@ventas/domain/value-objects/ids/item-carrito-id.vo';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { VentaException } from '@ventas/domain/exceptions/venta.exception';

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
  ) { }

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
      throw new VentaException(
        `La cantidad minima por producto es ${CANTIDAD_MINIMA}`,
      );
    }

    const CANTIDAD_MAXIMA = 10;
    if (cantidad > CANTIDAD_MAXIMA) {
      throw new VentaException(
        `La cantidad maxima por producto es ${CANTIDAD_MAXIMA}`,
      );
    }
  }

  public toPrimitives() {
    return {
      id: this.Id.getValue(),
      productoRef: this.productoRef.toPrimitives(),
      cantidad: this.cantidad,
      precioUnitario: this.precioUnitario.toPrimitives(),
    };
  }

  /**
   *
   * Valida la integridad de la línea de venta
   */
  // private validar(): void {
  //   if (this.cantidad.valor <= 0) {
  //     throw new Error('La cantidad debe ser mayor a 0');
  //   }

  //   if (this.precioUnitario.lessThanOrEqual(Money.cero())) {
  //     throw new Error('El precio unitario debe ser mayor a 0');
  //   }

  //   // Validar que el descuento no sea mayor al 100% (ya lo hace Descuento, pero validamos lógica de negocio adicional)
  //   if (this.descuento.porcentaje > 100) {
  //     throw new Error('El descuento no puede ser mayor al 100%');
  //   }

  //   // Validar que si hay descuento por monto, no exceda el precio del producto
  //   if (
  //     this.descuento.monto &&
  //     this.descuento.monto.greaterThan(this.precioUnitario)
  //   ) {
  //     throw new Error(
  //       'El descuento por monto no puede ser mayor al precio unitario',
  //     );
  //   }
  // }

  // get montoDescuento(): Money {
  //   if (!this.tieneDescuento()) {
  //     return Money.cero(this.precioUnitario.codigoMoneda);
  //   }

  //   // Si el descuento tiene monto específico, lo multiplicamos por la cantidad
  //   if (this.descuento.monto && this.descuento.monto.cantidadDecimal > 0) {
  //     return this.descuento.monto.multiplicar(this.cantidad.valor);
  //   }

  //   // Si es descuento porcentual
  //   return this.subtotal.multiplicar(this.descuento.porcentaje / 100);
  // }

  // get total(): Money {
  //   return this.subtotal.restar(this.montoDescuento);
  // }

  // static crearConDescuentoPorcentaje(
  //   productoId: ProductoId,
  //   cantidad: number,
  //   precioUnitario: Money,
  //   porcentajeDescuento: number,
  //   nombreProducto?: string,
  //   sku?: string,
  // ): ItemCarrito {
  //   return new ItemCarrito(
  //     productoId,
  //     Cantidad.create(cantidad),
  //     precioUnitario,
  //     Descuento.conPorcentaje(porcentajeDescuento),
  //     nombreProducto,
  //     sku,
  //   );
  // }

  // static crearConDescuentoMonto(
  //   productoId: ProductoId,
  //   cantidad: number,
  //   precioUnitario: Money,
  //   montoDescuento: Money,
  //   nombreProducto?: string,
  //   sku?: string,
  // ): ItemCarrito {
  //   // Validar que el monto de descuento no sea mayor al precio unitario
  //   if (montoDescuento.greaterThan(precioUnitario)) {
  //     throw new Error(
  //       'El descuento por monto no puede ser mayor al precio unitario',
  //     );
  //   }

  //   return new ItemCarrito(
  //     productoId,
  //     Cantidad.create(cantidad),
  //     precioUnitario,
  //     Descuento.conMonto(montoDescuento),
  //     nombreProducto,
  //     sku,
  //   );
  // }

  // actualizarCantidad(nuevaCantidad: number): ItemCarrito {
  //   return new ItemCarrito(
  //     this.productoId,
  //     Cantidad.create(nuevaCantidad),
  //     this.precioUnitario,
  //     this.descuento,
  //     this.nombreProducto,
  //     this.sku,
  //   );
  // }

  // actualizarPrecioUnitario(nuevoPrecio: Money): ItemCarrito {
  //   return new ItemCarrito(
  //     this.productoId,
  //     this.cantidad,
  //     nuevoPrecio,
  //     this.descuento,
  //     this.nombreProducto,
  //     this.sku,
  //   );
  // }

  // aplicarDescuentoPorcentaje(porcentajeDescuento: number): ItemCarrito {
  //   return new ItemCarrito(
  //     this.productoId,
  //     this.cantidad,
  //     this.precioUnitario,
  //     Descuento.conPorcentaje(porcentajeDescuento),
  //     this.nombreProducto,
  //     this.sku,
  //   );
  // }

  // aplicarDescuentoMonto(montoDescuento: Money): ItemCarrito {
  //   if (montoDescuento.greaterThan(this.precioUnitario)) {
  //     throw new Error(
  //       'El descuento por monto no puede ser mayor al precio unitario',
  //     );
  //   }

  //   return new ItemCarrito(
  //     this.productoId,
  //     this.cantidad,
  //     this.precioUnitario,
  //     Descuento.conMonto(montoDescuento),
  //     this.nombreProducto,
  //     this.sku,
  //   );
  // }

  // sinDescuento(): ItemCarrito {
  //   return new ItemCarrito(
  //     this.productoId,
  //     this.cantidad,
  //     this.precioUnitario,
  //     Descuento.sin(),
  //     this.nombreProducto,
  //     this.sku,
  //   );
  // }

  // tieneDescuento(): boolean {
  //   return this.descuento.tieneDescuento();
  // }

  // equals(other: ItemCarrito): boolean {
  //   return (
  //     this.productoId.equals(other.productoId) &&
  //     this.cantidad.equals(other.cantidad) &&
  //     this.precioUnitario.equals(other.precioUnitario) &&
  //     this.descuento.equals(other.descuento)
  //   );
  // }
}
