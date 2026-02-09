import { Money } from '@shared/domain/money';
import { VentaId } from './value-objects/venta-id';
import { Cantidad } from './value-objects/cantidad';
import { Estado, EstadoVenta } from './value-objects/estado';
import { Descuento } from './value-objects/descuento';
import { Impuesto } from './value-objects/impuesto';
import { ReferenciaPago } from './value-objects/referencia-pago';
import { NotasVenta } from './value-objects/notas-venta';

/**
 * Entidad que representa una venta en el sistema
 * @param id Identificador único de la venta
 * @param cantidad Cantidad de unidades vendidas
 * @param precioUnitario Precio por unidad
 * @param subtotal Subtotal antes de descuentos e impuestos
 * @param descuento Descuento aplicado (opcional)
 * @param impuesto Impuesto aplicado
 * @param total Total final de la venta
 * @param estado Estado actual de la venta
 * @param referenciaPago Referencia de la transacción de pago (opcional)
 * @param notas Notas adicionales (opcional)
 * @param fecha Fecha de creación de la venta
 */
export class Venta {
  constructor(
    public readonly id: VentaId,
    public readonly cantidad: Cantidad,
    public readonly precioUnitario: Money,
    public readonly subtotal: Money,
    public readonly descuento: Descuento,
    public readonly impuesto: Impuesto,
    public readonly total: Money,
    public readonly estado: Estado = Estado.create(EstadoVenta.PENDIENTE),
    public readonly referenciaPago?: ReferenciaPago,
    public readonly notas: NotasVenta = NotasVenta.vacia(),
    public readonly fecha: Date = new Date()
  ) {
    this.validar();
  }

  /**
   * Valida la integridad de la venta
   */
  private validar(): void {
    if (this.total.cantidadDecimal <= 0) {
      throw new Error('El total de la venta debe ser mayor a 0');
    }
  }

  /**
   * Crea una nueva venta 
   */
  static crear(
    cantidad: Cantidad,
    precioUnitario: Money,
    descuento?: Descuento,
    impuesto?: Impuesto,
    referenciaPago?: ReferenciaPago,
    notas?: NotasVenta
  ): Venta {
    // Calcular subtotal: cantidad × precioUnitario
    const subtotal = precioUnitario.multiplicar(cantidad.value);
    
    const desc = descuento ?? Descuento.sin();
    const imp = impuesto ?? Impuesto.cero();
    
    // Calcular descuento en dinero
    const montoDescuento = subtotal.multiplicar(desc.porcentaje / 100);
    
    // Calcular total: subtotal - descuento + impuesto
    const totalConDescuento = subtotal.restar(montoDescuento);
    const total = totalConDescuento.sumar(imp.monto);

    return new Venta(
      VentaId.create(),
      cantidad,
      precioUnitario,
      subtotal,
      desc,
      imp,
      total,
      Estado.create(EstadoVenta.PENDIENTE),
      referenciaPago,
      notas ?? NotasVenta.vacia(),
      new Date()
    );
  }

  /**
   * Marca la venta como completada
   */
  completar(): Venta {
    return new Venta(
      this.id,
      this.cantidad,
      this.precioUnitario,
      this.subtotal,
      this.descuento,
      this.impuesto,
      this.total,
      Estado.create(EstadoVenta.COMPLETADA),
      this.referenciaPago,
      this.notas,
      this.fecha
    );
  }

  /**
   * Marca la venta como cancelada
   */
  cancelar(): Venta {
    return new Venta(
      this.id,
      this.cantidad,
      this.precioUnitario,
      this.subtotal,
      this.descuento,
      this.impuesto,
      this.total,
      Estado.create(EstadoVenta.CANCELADA),
      this.referenciaPago,
      this.notas,
      this.fecha
    );
  }

  /**
   * Verifica si la venta está completada
   */
  estaCompletada(): boolean {
    return this.estado.isCompletada();
  }

  /**
   * Verifica si la venta está cancelada
   */
  estaCancelada(): boolean {
    return this.estado.isCancelada();
  }
}