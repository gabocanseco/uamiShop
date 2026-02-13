import {DateTime} from "@shared/domain/datetime";
import {OrdenException} from "@ordenes/domain/exception/orden-exception";
import {EstadoPago} from "@ordenes/domain/enums/estado-pago";

/**
 * @param referenciaExterna - Identificador de un servicio externo para poder intercomunicarse
 */
export class ResumenPago {
    private constructor(
        private readonly metodoPago: string,
        private readonly estado: EstadoPago,
        private readonly referenciaExterna?: string,
        private readonly fechaProcesamiento?: DateTime
    ) {
        this.metodoPago = metodoPago;
        this.referenciaExterna = referenciaExterna;
        this.estado = estado;
        this.fechaProcesamiento = fechaProcesamiento
    }

    public static crear(
        metodoPago: string,
    ): ResumenPago {
        return new ResumenPago(
            metodoPago,
            EstadoPago.PENDIENTE,
        )
    }

    public procesar(): ResumenPago {
        return new ResumenPago(
            this.metodoPago,
            EstadoPago.PROCESANDO
        )
    }

    public aprobar(
        referenciaExterna: string,
    ): ResumenPago {
        if (!referenciaExterna || referenciaExterna.trim().length === 0) {
            throw new OrdenException(
                'La referencia de Pago no puede estar vacía'
            )
        }

        return new ResumenPago(
            this.metodoPago,
            EstadoPago.APROBADO,
            referenciaExterna,
            DateTime.now()
        )
    }

    public aprobado(): boolean {
        return this.estado === EstadoPago.APROBADO;
    }

    public rechazar(): ResumenPago {
        return new ResumenPago(
            this.metodoPago,
            EstadoPago.RECHAZADO,
            undefined,
            DateTime.now()
        )
    }
}