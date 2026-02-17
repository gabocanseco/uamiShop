// No se usa

// /**
//  * Notas o comentarios de la venta
//  * @param value Texto con las notas (máximo 500 caracteres)
//  */
// export class NotasVenta {
//   constructor(readonly value: string = '') {
//     if (value.length > 500) {
//       throw new Error('Las notas no pueden exceder 500 caracteres');
//     }
//   }

//   static create(value: string = ''): NotasVenta {
//     return new NotasVenta(value);
//   }

//   static vacia(): NotasVenta {
//     return new NotasVenta('');
//   }

//   tieneNotas(): boolean {
//     return this.value.trim().length > 0;
//   }

//   equals(other: NotasVenta): boolean {
//     return this.value === other.value;
//   }

//   toString(): string {
//     return this.value;
//   }
// }
