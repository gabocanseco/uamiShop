// No se usa

// import { Money } from '@shared/domain/value-objects/money.vo';

// /**
//  * Impuesto aplicado a una venta
//  * @param porcentaje Porcentaje de impuesto (entre 0 y 100)
//  * @param monto Monto del impuesto en Money
//  */
// export class Impuesto {
//   constructor(
//     readonly porcentaje: number,
//     readonly monto: Money,
//   ) {
//     if (porcentaje < 0 || porcentaje > 100) {
//       throw new Error('Porcentaje de impuesto debe estar entre 0 y 100');
//     }
//   }

//   static create(porcentaje: number, monto: Money): Impuesto {
//     return new Impuesto(porcentaje, monto);
//   }

//   static cero(): Impuesto {
//     return new Impuesto(0, Money.cero());
//   }

//   tieneImpuesto(): boolean {
//     return this.porcentaje > 0 && this.monto.getCantidad() > 0;
//   }

//   equals(other: Impuesto): boolean {
//     return (
//       this.porcentaje === other.porcentaje && this.monto.equals(other.monto)
//     );
//   }

//   toString(): string {
//     return `${this.porcentaje}% - ${this.monto.toString()}`;
//   }
// }
