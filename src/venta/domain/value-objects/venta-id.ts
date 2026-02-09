import { v4 as uuidv4 } from 'uuid';

/**
 * Identificador único para una venta
 * @param value UUID único de la venta
 */
export class VentaId {
  constructor(readonly value: string = uuidv4()) {
    if (!value || typeof value !== 'string') {
      throw new Error('VentaId debe ser un string válido');
    }
  }

  static create(value?: string): VentaId {
    return new VentaId(value);
  }

  equals(other: VentaId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
