import Dinero from 'dinero.js';
import {DomainException} from "@shared/exception/domain-exception";

export class Money {
    private readonly cantidad: number;
    private readonly moneda: string;

    private constructor(cantidad: number, moneda: string) {
        this.cantidad = cantidad;
        this.moneda = moneda
    }
    
    public static crear(cantidad: number, moneda: string = "MXN"): Money {
        // Dinero.js v1 usa montos en centavos (enteros)
        return new Money(Math.round(cantidad * 100), moneda);
    }

    public sumar(otro: Money): Money {
        const dineroA = Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        });
        const dineroB = Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        });

        if (!dineroA.hasSameCurrency(dineroB)) {
            throw new DomainException("No se pueden sumar montos de diferentes monedas")
        }

        const resultado = dineroA.add(dineroB)

        return new Money(resultado.getAmount(), resultado.getCurrency());
    }

    public restar(otro: Money): Money {
        const dineroA = Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        });
        const dineroB = Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        });

        const resultado = dineroA.subtract(dineroB);

        if (resultado.isNegative()) {
            throw new DomainException("El resultado de una resta no puede ser negativo")
        }

        return new Money(resultado.getAmount(), resultado.getCurrency());
    }

    public multiplicar(factor: number): Money {
        const resultado = Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).multiply(factor);
        return new Money(resultado.getAmount(), resultado.getCurrency());
    }

    public lessThan(otro: Money): boolean {
        return Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).lessThan(Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        }));
    }

    public lessThanOrEqual(otro: Money): boolean {
        return Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).lessThanOrEqual(Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        }));
    }

    public greaterThan(otro: Money): boolean {
        return Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).greaterThan(Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        }));
    }

    public greaterThanOrEqual(otro: Money): boolean {
        return Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).greaterThanOrEqual(Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        }));
    }

    public get cantidadDecimal(): number {
        return this.cantidad / 100;
    }

    public get codigoMoneda(): string {
        return this.moneda;
    }
    public equals(otro: Money): boolean {
        return Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).equalsTo(Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        }));
    }

    public isZero(): boolean {
        return Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).isZero();
    }

    public isNegative(): boolean {
        return Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).isNegative();
    }

    public isPositive(): boolean {
        return Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).isPositive();
    }

    public toString(): string {
        return `${this.codigoMoneda} ${this.cantidadDecimal.toFixed(2)}`;
    }
    
    public static cero(moneda: string = "MXN"): Money {
        return new Money(0, moneda);
    }
}
