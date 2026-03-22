import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { ItemCarrito } from '@ventas/domain/entities/item-carrito.entity';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { Descuento } from '../value-objects/descuento';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { EstadoCarrito } from '../enums/estado-carrito.enum';
import { ProductoRef } from '../value-objects/producto-ref.vo';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';

export class Carrito {
  private constructor(
    private carritoId: CarritoId,
    private clienteId: ClienteId,
    private items: Map<string, ItemCarrito>,
    private descuentos: Descuento[],
    private estado: EstadoCarrito,
    private fechaCreacion: DateTime,
    private fechaActualizacion: DateTime,
  ) {}

  public static crear(clienteId: ClienteId): Carrito {
    return new Carrito(
      CarritoId.generar(),
      clienteId,
      new Map<string, ItemCarrito>(),
      [],
      EstadoCarrito.ACTIVO,
      DateTime.now(),
      DateTime.now(),
    );
  }

  public static reconstruct(props: {
    id: CarritoId;
    clienteId: ClienteId;
    items: Map<string, ItemCarrito>;
    descuentos: Descuento[];
    estado: EstadoCarrito;
    fechaCreacion: DateTime;
    fechaActualizacion: DateTime;
  }): Carrito {
    return new Carrito(
      props.id,
      props.clienteId,
      props.items,
      props.descuentos,
      props.estado,
      props.fechaCreacion,
      props.fechaActualizacion,
    );
  }

  public agregarProducto(
    productoRef: ProductoRef,
    cantidad: number,
    precioUnitario: Money,
  ): void {
    const MAX_ITEMS = 20;
    if (this.items.size >= MAX_ITEMS) {
      throw new BusinessRuleException(
        `No se puede tener más de ${MAX_ITEMS} productos diferentes`,
      );
    }

    const productoIdValue = productoRef.getProductoId().getValue();

    // si el producto ya existe en el carrito, se suma la cantidad
    const itemCarrito = this.items.get(productoIdValue);
    if (itemCarrito) {
      itemCarrito.incrementarCantidad(cantidad);
      return;
    }

    const nuevoItemCarrito = ItemCarrito.crear(
      productoRef,
      cantidad,
      precioUnitario,
    );
    this.items.set(productoIdValue, nuevoItemCarrito);
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  public modificarCantidad(
    productoId: ProductoId,
    nuevaCantidad: number,
  ): void {
    const key = productoId.getValue();
    const item = this.items.get(key);
    if (!item) {
      throw new BusinessRuleException('Producto no encontrado en el carrito');
    }

    if (this.estado === EstadoCarrito.EN_CHECKOUT) {
      throw new BusinessRuleException(
        'No se puede modificar la cantidad si el carrito está en checkout',
      );
    }

    const CANTIDAD_MINIMA = 1;
    if (nuevaCantidad < CANTIDAD_MINIMA) {
      this.eliminarProducto(productoId);
      return;
    }

    item.actualizarCantidad(nuevaCantidad);
  }

  /**
   * Elimina un producto del carrito
   */
  public eliminarProducto(productoId: ProductoId): void {
    if (this.estado === EstadoCarrito.EN_CHECKOUT) {
      throw new BusinessRuleException(
        'No se puede eliminar un producto si el carrito está en checkout',
      );
    }

    const key = productoId.getValue();
    const item = this.items.get(key);
    if (!item) {
      throw new BusinessRuleException(
        'Debe existir el producto en el carrito para poder eliminarlo',
      );
    }

    this.items.delete(key);
  }

  public vaciar(): void {
    if (this.estado === EstadoCarrito.EN_CHECKOUT) {
      throw new BusinessRuleException(
        'No se puede vaciar un carrito que está en checkout',
      );
    }

    this.items.clear();
  }

  public calcularSubtotal(): Money {
    if (this.items.size <= 0) {
      return Money.cero();
    }

    let subtotal = Money.cero();
    this.items.forEach((item) => {
      subtotal = subtotal.sumar(item.calcularSubtotal());
    });

    return subtotal;
  }

  public calcularTotal(): Money {
    const subtotal = this.calcularSubtotal();

    // aplicar descuentos al subtotal
    let montoDescuento = Money.cero();

    this.descuentos.forEach((descuento) => {
      montoDescuento = montoDescuento.sumar(
        descuento.calcularDescuento(subtotal),
      );
    });

    return subtotal.restar(montoDescuento);
  }

  public calcularTotalSinDescuentos(): Money {
    return this.calcularSubtotal();
  }

  public aplicarDescuento(descuento: Descuento): void {
    if (this.estado !== EstadoCarrito.ACTIVO) {
      throw new BusinessRuleException(
        'Solo se pueden aplicar descuentos a carritos activos',
      );
    }

    this.descuentos.push(descuento);
    this.fechaActualizacion = DateTime.now();
  }

  public iniciarCheckout(): void {
    // El carrito debe tener al menos un producto
    const MIN_ITEMS = 1;
    if (this.items.size < MIN_ITEMS) {
      throw new BusinessRuleException(
        'El carrito debe tener al menos un producto',
      );
    }

    if (this.estado !== EstadoCarrito.ACTIVO) {
      throw new BusinessRuleException(
        'Solo se puede iniciar el checkout si el carrito está activo',
      );
    }

    this.estado = EstadoCarrito.EN_CHECKOUT;
    this.fechaActualizacion = DateTime.now();
  }

  public completarCheckout(): void {
    if (this.estado !== EstadoCarrito.EN_CHECKOUT) {
      throw new BusinessRuleException(
        'Solo se puede completar el checkout si el carrito no está en checkout',
      );
    }

    this.estado = EstadoCarrito.COMPLETADO;
    this.fechaActualizacion = DateTime.now();
  }

  public abandonar(): void {
    if (
      this.estado !== EstadoCarrito.ACTIVO &&
      this.estado !== EstadoCarrito.EN_CHECKOUT
    ) {
      throw new BusinessRuleException(
        'Solo se pueden abandonar carritos activos o en checkout',
      );
    }

    this.estado = EstadoCarrito.ABANDONADO;
    this.fechaActualizacion = DateTime.now();
  }

  public obtenerCantidadItems(): number {
    return this.items.size;
  }

  public getId(): CarritoId {
    return this.carritoId;
  }

  public getClienteId(): ClienteId {
    return this.clienteId;
  }

  public getItems(): ItemCarrito[] {
    return Array.from(this.items.values());
  }

  public getEstado(): EstadoCarrito {
    return this.estado;
  }

  public toPrimitives() {
    return {
      id: this.carritoId.getValue(),
      clienteId: this.clienteId.getValue(),
      descuentos: this.descuentos.map((descuento) => descuento.toPrimitives()),
      items: Array.from(this.items.values()).map((item) => item.toPrimitives()),
      estado: this.estado,
      fechaCreacion: this.fechaCreacion.getValue(),
      fechaActualizacion: this.fechaActualizacion.getValue(),
    };
  }

}
