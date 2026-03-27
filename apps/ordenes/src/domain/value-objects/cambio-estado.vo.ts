import { DateTime } from '@app/shared/domain/value-objects/datetime.vo';
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

  public getEstadoNuevo(): EstadoOrden {
    return this.estadoNuevo;
  }
  public getFecha(): DateTime {
    return this.fecha;
  }
  public getMotivo(): string {
    return this.motivo;
  }
  public getUsuario(): string {
    return this.usuario;
  }
  public getEstadoAnterior(): EstadoOrden | undefined {
    return this.estadoAnterior;
  }

  static reconstruct(props: {
    estadoNuevo: EstadoOrden;
    fecha: DateTime;
    motivo: string;
    usuario: string;
    estadoAnterior?: EstadoOrden;
  }): CambioEstado {
    return new CambioEstado(
      props.estadoNuevo,
      props.fecha,
      props.motivo,
      props.usuario,
      props.estadoAnterior,
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
