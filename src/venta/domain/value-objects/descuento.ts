import { Money } from '@shared/domain/money';

/**
 * Descuento aplicado a una venta
 * @param porcentaje Porcentaje de descuento (entre 0 y 100)
 * @param monto Monto de descuento en Money (opcional)
 */
export class Descuento {
  constructor(
    readonly porcentaje: number,
    readonly monto : Money = Money.cero()
  ) {
    if (porcentaje < 0 || porcentaje > 100) {
      throw new Error('Porcentaje de descuento debe estar entre 0 y 100');
    }
  }

  static conPorcentaje(porcentaje: number): Descuento {
    return new Descuento(porcentaje);
  }

  static conMonto(monto: Money): Descuento {
    return new Descuento(0, monto);
  }

  static sin(): Descuento {
    return new Descuento(0);
  }

  tieneDescuento(): boolean {
    return this.porcentaje > 0 || (this.monto !== undefined && this.monto.cantidadDecimal > 0);
  }
  // Método para comparar dos descuentos
  equals(other: Descuento): boolean {
  if (this.porcentaje !== other.porcentaje) return false;
  
  if (this.monto === undefined && other.monto === undefined) return true;
  if (this.monto === undefined || other.monto === undefined) return false;
  
  return this.monto.equals(other.monto);
}

  toString(): string {
    if (this.monto) {
      return `${this.monto.toString()}`;
    }
    return `${this.porcentaje}%`;
  }
}
