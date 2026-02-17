import { Money } from '@shared/domain/value-objects/money.vo';
import { TipoDescuento } from '../enums/tipo-descuento.enum';

/**
 * Descuento aplicado a una venta
 * @param valor Porcentaje de descuento (entre 0 y 100)
 * @param monto Monto de descuento en Money (opcional)
 */
export class Descuento {
  private constructor(
    private readonly codigo: string,
    private readonly tipo: TipoDescuento,
    private readonly valor: number, // porcentaje a descontar
    private readonly montoDescontado: Money, // monto descontado despues de calcular el descuento
  ) {}

  public static crear(
    codigo: string,
    tipo: TipoDescuento,
    valor: number,
  ): Descuento {
    if (tipo === TipoDescuento.PORCENTAJE) {
      if (valor < 0 || valor > 100) {
        throw new Error('El porcentaje de descuento debe estar entre 0 y 100');
      }
    }

    return new Descuento(codigo, tipo, valor, Money.cero());
  }

  public calcularDescuento(subtotal: Money): Money {
    if (this.tipo === TipoDescuento.PORCENTAJE) {
      const montoDescuento = subtotal.multiplicar(this.valor / 100);
      return montoDescuento;
    }

    return Money.cero();
  }

  public toPrimitives() {
    return {
      codigo: this.codigo,
      tipo: this.tipo.toString(),
      valor: this.valor,
      montoDescontado: this.montoDescontado.toPrimitives(),
    };
  }

  // static conPorcentaje(porcentaje: number): Descuento {
  //   return new Descuento(porcentaje);
  // }

  // static conMonto(monto: Money): Descuento {
  //   return new Descuento(0, monto);
  // }

  // static sin(): Descuento {
  //   return new Descuento(0);
  // }

  // tieneDescuento(): boolean {
  //   return (
  //     this.porcentaje > 0 ||
  //     (this.monto !== undefined && this.monto.getCantidad() > 0)
  //   );
  // }
  // // Método para comparar dos descuentos
  // equals(other: Descuento): boolean {
  //   if (this.porcentaje !== other.porcentaje) return false;

  //   if (this.monto === undefined && other.monto === undefined) return true;
  //   if (this.monto === undefined || other.monto === undefined) return false;

  //   return this.monto.equals(other.monto);
  // }

  // toString(): string {
  //   if (this.monto) {
  //     return `${this.monto.toString()}`;
  //   }
  //   return `${this.porcentaje}%`;
  // }
}
