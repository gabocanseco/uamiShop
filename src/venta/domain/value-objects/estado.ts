  export enum EstadoVenta {
    PENDIENTE = 'PENDIENTE',
    COMPLETADA = 'COMPLETADA',
    CANCELADA = 'CANCELADA',
    DEVUELTA = 'DEVUELTA'
  }

  /**
   * Estado de una venta
   * @param value Estado de la venta (PENDIENTE, COMPLETADA, CANCELADA, DEVUELTA)
   */
  export class Estado {
    constructor(readonly value: EstadoVenta = EstadoVenta.PENDIENTE) {
      if (!Object.values(EstadoVenta).includes(value)) {
        throw new Error('Estado de venta no válido');
      }
    }

    static create(value: EstadoVenta = EstadoVenta.PENDIENTE): Estado {
      return new Estado(value);
    }

    isPendiente(): boolean {
      return this.value === EstadoVenta.PENDIENTE;
    }

    isCompletada(): boolean {
      return this.value === EstadoVenta.COMPLETADA;
    }

    isCancelada(): boolean {
      return this.value === EstadoVenta.CANCELADA;
    }

    equals(other: Estado): boolean {
      return this.value === other.value;
    }

    toString(): string {
      return this.value;
    }
  }
