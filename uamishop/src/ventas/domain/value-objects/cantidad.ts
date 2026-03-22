/**
 * Cantidad de unidades vendidas
 * @param value Número de unidades (debe ser entero positivo)
 */
export class Cantidad {
  constructor(readonly valor: number) {
    if (valor <= 0 || !Number.isInteger(valor)) {
      throw new Error('Cantidad debe ser un número entero positivo');
    }
  }

  static create(valor: number): Cantidad {
    return new Cantidad(valor);
  }

  equals(other: Cantidad): boolean {
    return this.valor === other.valor;
  }

  toString(): string {
    return this.valor.toString();
  }
}
