import Dinero from 'dinero.js';

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
        const resultado = Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).add(Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        }));

        return new Money(resultado.getAmount(), resultado.getCurrency());
    }

    public restar(otro: Money): Money {
        const resultado = Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).subtract(Dinero({
            amount: otro.cantidad,
            currency: otro.moneda as Dinero.Currency
        }));

        return new Money(resultado.getAmount(), resultado.getCurrency());
    }

    public multiplicar(factor: number): Money {
        const resultado = Dinero({
            amount: this.cantidad,
            currency: this.moneda as Dinero.Currency
        }).multiply(factor);
        return new Money(resultado.getAmount(), resultado.getCurrency());
    }

    public get cantidadDecimal(): number {
        return this.cantidad / 100;
    }

    public get codigoMoneda(): string {
        return this.moneda;
    }
}
