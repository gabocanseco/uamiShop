// No se usa

// import { v4 as uuidv4 } from 'uuid';

// /**
//  * Identificador único para una línea de venta
//  * @param value UUID único de la línea de venta
//  */
// export class LineaVentaId {
//   constructor(readonly value: string = uuidv4()) {
//     if (!value || typeof value !== 'string') {
//       throw new Error('LineaVentaId debe ser un string válido');
//     }
//   }

//   static create(value?: string): LineaVentaId {
//     return new LineaVentaId(value);
//   }

//   equals(other: LineaVentaId): boolean {
//     return this.value === other.value;
//   }

//   toString(): string {
//     return this.value;
//   }
// }
