/**
 * Referencia única del pago/transacción
 * @param value Identificador de la transacción de pago
 */
export class ReferenciaPago {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('ReferenciaPago no puede estar vacía');
    }
  }

  static create(value: string): ReferenciaPago {
    return new ReferenciaPago(value);
  }

  equals(other: ReferenciaPago): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
