import {Money} from "@shared/domain/money";
import {DomainException} from "@shared/exception/domain-exception";

describe('Money Value Object', () => {
    describe('Suma de monedas', () => {
        it('No se pueden sumar montos de diferentes monedas', () => {
            const dinero_mxn = Money.crear(10, "MXN");
            const dinero_usd = Money.crear(10, "USD");

            expect(() => {
                dinero_mxn.sumar(dinero_usd);
            }).toThrow(DomainException);
        });
   });

    describe('Resta de monedas', () => {
        it('El resultado de una resta no puede ser negativo', () => {
            const dinero1 = Money.crear(10, "MXN");
            const dinero2 = Money.crear(15, "MXN");

            expect(() => {
                dinero1.restar(dinero2);
            }).toThrow(DomainException);
        });
    });
});