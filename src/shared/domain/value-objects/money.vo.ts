import Dinero from 'dinero.js';
import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class Money {
  private readonly cantidad: number;
  private readonly moneda: string;

  private constructor(cantidad: number, moneda: string) {
    this.cantidad = cantidad;
    this.moneda = moneda;
  }

  public getCantidad(): number {
    return this.cantidad / 100;
  }

  public get codigoMoneda(): string {
    return this.moneda;
  }

  private toDinero(): Dinero.Dinero {
    return Dinero({
      amount: this.cantidad,
      currency: this.moneda as Dinero.Currency,
    });
  }

  public static crear(cantidad: number, moneda: string = 'MXN'): Money {
    // $10.50 -> 1050
    return new Money(Math.round(cantidad * 100), moneda.toUpperCase());
  }

  public sumar(otro: Money): Money {
    const dineroA = this.toDinero();
    const dineroB = otro.toDinero();

    if (!dineroA.hasSameCurrency(dineroB)) {
      throw new DomainException(
        'No se pueden sumar montos de diferentes monedas',
      );
    }

    const resultado = dineroA.add(dineroB);

    return new Money(resultado.getAmount(), resultado.getCurrency());
  }

  public restar(otro: Money): Money {
    const dineroA = this.toDinero();
    const dineroB = otro.toDinero();

    if (!dineroA.hasSameCurrency(dineroB)) {
      throw new DomainException(
        'No se pueden restar montos de diferentes monedas',
      );
    }

    const resultado = dineroA.subtract(dineroB);

    if (resultado.isNegative()) {
      throw new DomainException(
        'El resultado de una resta no puede ser negativo',
      );
    }

    return new Money(resultado.getAmount(), resultado.getCurrency());
  }

  public multiplicar(factor: number): Money {
    const resultado = this.toDinero().multiply(factor);

    return new Money(resultado.getAmount(), resultado.getCurrency());
  }

  public lessThan(otro: Money): boolean {
    return this.toDinero().lessThan(otro.toDinero());
  }

  public lessThanOrEqual(otro: Money): boolean {
    return this.toDinero().lessThanOrEqual(otro.toDinero());
  }

  public greaterThan(otro: Money): boolean {
    return this.toDinero().greaterThan(otro.toDinero());
  }

  public greaterThanOrEqual(otro: Money): boolean {
    return this.toDinero().greaterThanOrEqual(otro.toDinero());
  }

  public equals(otro: Money): boolean {
    return this.toDinero().equalsTo(otro.toDinero());
  }

  public isZero(): boolean {
    return this.toDinero().isZero();
  }

  public isNegative(): boolean {
    return this.toDinero().isNegative();
  }

  public isPositive(): boolean {
    return this.toDinero().isPositive();
  }

  public toString(): string {
    return `${this.codigoMoneda} ${this.getCantidad().toFixed(2)}`;
  }

  public static cero(moneda: string = 'MXN'): Money {
    return new Money(0, moneda);
  }
}
