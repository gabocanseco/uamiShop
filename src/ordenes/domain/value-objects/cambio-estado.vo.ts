import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { EstadoOrden } from '@ordenes/domain/enums/estado-orden.enum';

export class CambioEstado {
  private constructor(
    private readonly estadoNuevo: EstadoOrden,
    private readonly fecha: DateTime,
    private readonly motivo: string,
    private readonly usuario: string,
    private readonly estadoAnterior?: EstadoOrden,
  ) {}

  public static crear(
    fecha: DateTime,
    motivo: string,
    usuario: string,
  ): CambioEstado {
    return new CambioEstado(EstadoOrden.PENDIENTE, fecha, motivo, usuario);
  }

  public static cambiar(
    estadoAnterior: EstadoOrden,
    estadoNuevo: EstadoOrden,
    fecha: DateTime,
    motivo: string,
    usuario: string,
  ): CambioEstado {
    return new CambioEstado(
      estadoNuevo,
      fecha,
      motivo,
      usuario,
      estadoAnterior,
    );
  }

  public toPrimitives() {
    return {
      estadoNuevo: this.estadoNuevo.toString(),
      fecha: this.fecha.getValue(),
      motivo: this.motivo,
      usuario: this.usuario,
      estadoAnterior: this.estadoAnterior?.toString(),
    };
  }
}
