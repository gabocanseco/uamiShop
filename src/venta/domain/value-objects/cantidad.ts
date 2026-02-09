/**
 * Cantidad de unidades vendidas
 * @param value Número de unidades (debe ser entero positivo)
 */
export class Cantidad {
  constructor(readonly value: number) {
    if (value <= 0 || !Number.isInteger(value)) {
      throw new Error('Cantidad debe ser un número entero positivo');
    }
  }

  static create(value: number): Cantidad {
    return new Cantidad(value);
  }

  equals(other: Cantidad): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}
