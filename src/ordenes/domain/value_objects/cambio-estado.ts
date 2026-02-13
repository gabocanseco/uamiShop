import {DateTime} from "@shared/domain/datetime";

export class CambioEstado {
    private constructor(
        private readonly estadoAnterior: EstadoOrden | null,
        private readonly estadoNuevo: EstadoOrden,
        private readonly fecha: DateTime,
        private readonly motivo: string,
        private readonly usuario: string
    ) {
        this.estadoAnterior = estadoAnterior;
        this.estadoNuevo = estadoNuevo;
        this.fecha = fecha;
        this.motivo = motivo;
        this.usuario = usuario;
    }

    public static crear(
        estadoAnterior: EstadoOrden | null,
        estadoNuevo: EstadoOrden,
        fecha: DateTime,
        motivo: string,
        usuario: string
    ): CambioEstado {
        return new CambioEstado(
            estadoAnterior,
            estadoNuevo,
            fecha,
            motivo,
            usuario,
        )
    }
}