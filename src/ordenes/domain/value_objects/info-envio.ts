import {DateTime} from "@shared/domain/datetime";
import {OrdenException} from "@ordenes/domain/exception/orden-exception";

export class InfoEnvio {
    private constructor(
        private readonly proveedorLogistico: string,
        private readonly numeroGuia: string,
        private readonly fechaEtimadaEntrega: DateTime
    ) {
       this.proveedorLogistico = proveedorLogistico;
       this.numeroGuia = numeroGuia;
       this.fechaEtimadaEntrega = fechaEtimadaEntrega;
    }

    public static crear(
        proveedorLogistico: string,
        numeroGuia: string,
        fechaEtimadaEntrega: DateTime
    ): InfoEnvio {
        if (!numeroGuia || numeroGuia.trim().length === 0) {
            throw new OrdenException(
                `Debe proporcionarse el número de gui del envio`
            )
        }

        const MIN_NUM_CHARS = 10;
        if (numeroGuia.length < MIN_NUM_CHARS) {
            throw new OrdenException(
                `El número de guia debe tener al menos 10 caracteres`
            )
        }

        return new InfoEnvio(
            proveedorLogistico,
            numeroGuia,
            fechaEtimadaEntrega
        )
    }
}