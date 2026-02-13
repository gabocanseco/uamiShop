import {Money} from "@shared/domain/money";
import {DateTime} from "@shared/domain/datetime";
import {OrdenId} from "@ordenes/domain/value_objects/orden-id";
import {ClienteId} from "@shared/domain/cliente-id";
import {ItemOrden} from "@ordenes/domain/entities/item-orden";
import {DireccionEnvio} from "@shared/domain/direccion-envio";
import {ResumenPago} from "@ordenes/domain/value_objects/resumen-pago";
import {InfoEnvio} from "@ordenes/domain/value_objects/info-envio";
import {CambioEstado} from "@ordenes/domain/value_objects/cambio-estado";
import {OrdenException} from "@ordenes/domain/exception/orden-exception";
import {EstadoOrden} from "@ordenes/domain/enums/estado-orden";

/**
 * Gestiona el ciclo de vida completo desde la creación hasta la entrega
 */
export class Orden {
    private constructor(
        private readonly id: OrdenId,
        private numeroOrden: string,
        private clienteId: ClienteId,
        private items: ItemOrden[],
        private direccionEnvio: DireccionEnvio,
        private resumenPago: ResumenPago,
        private subtotal: Money,
        private descuento: Money,
        private total: Money,
        private estado: EstadoOrden,
        private fechaCreacion: DateTime,
        private historialEstados: CambioEstado[],
        private infoEnvio?: InfoEnvio,
    ) {
        this.id = id;
        this.numeroOrden = numeroOrden;
        this.clienteId = clienteId;
        this.items = items;
        this.direccionEnvio = direccionEnvio;
        this.resumenPago = resumenPago;
        this.subtotal = total;
        this.descuento = descuento;
        this.total = total;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
        this.historialEstados = historialEstados;
    }

    public static crear(
        clienteId: ClienteId,
        items: ItemOrden[],
        direccion: DireccionEnvio,
        pago: ResumenPago
    ) {
        const MIN_NUM_ITEMS = 1
        if (items.length < MIN_NUM_ITEMS) {
            throw new OrdenException(
                `Una orden debe tener al menos ${MIN_NUM_ITEMS} item`
            );
        }

        const total = items.reduce(
            (acumulado: Money, item: ItemOrden) => acumulado.sumar(item.calcularSubtotal()),
            Money.cero('MXN')
        );

        if (total.lessThanOrEqual(Money.cero('MXN'))) {
            throw new OrdenException(
                'El total de la orden debe ser mayor a cero'
            )
        }

        // Calcular descuento
        const descuento= Money.crear(0, 'MXN');

        const numeroOrden = "12345";

        const subtotal = total.restar(descuento);

        const estado = EstadoOrden.PENDIENTE;

        const fechaCreacion = DateTime.now();

        const cambioEstado = CambioEstado.crear(
            null,
            estado,
            fechaCreacion,
            "Orden creada",
            clienteId.getValue()
        );
        const historialEstados: CambioEstado[] = [cambioEstado];

        return new Orden(
            OrdenId.generar(),
            numeroOrden,
            clienteId,
            items,
            direccion,
            pago,
            subtotal,
            descuento,
            total,
            estado,
            fechaCreacion,
            historialEstados,
        );
    }

    public confirmar(): void {
        if (this.estado != EstadoOrden.PENDIENTE) {
            throw new OrdenException(
                `Solo se puede confimar una orden en estado ${EstadoOrden.PENDIENTE}`
            )
        }

        const nuevoEstado = EstadoOrden.CONFIRMADA;
        const cambioEstado = CambioEstado.crear(
            this.estado,
            nuevoEstado,
            DateTime.now(),
            "Confirmar Orden",
            this.clienteId.getValue()
        )
        this.historialEstados.push(cambioEstado)
        this.estado = nuevoEstado;
    }

    public procesarPago(refereciaPago: string): void {
        if (this.estado != EstadoOrden.CONFIRMADA) {
            throw new OrdenException(
                `Solo se puede procesar el pago si la orden está ${EstadoOrden.CONFIRMADA}`
            )
        }

        this.resumenPago = this.resumenPago.aprobar(refereciaPago);

        const nuevoEstado = EstadoOrden.PAGO_PROCESADO;
        const cambioEstado = CambioEstado.crear(
            this.estado,
            nuevoEstado,
            DateTime.now(),
            "Pago Procesado",
            this.clienteId.getValue()
        )
        this.historialEstados.push(cambioEstado)
        this.estado = nuevoEstado;
    }

    public marcarEnProceso(): void {
        if (!this.resumenPago.aprobado()) {
            throw new OrdenException(
                `No se puede marcar ${EstadoOrden.EN_PREPARACION} porque el pago no fue aprobado`
            )
        }

        const nuevoEstado = EstadoOrden.EN_PREPARACION;
        const cambioEstado = CambioEstado.crear(
            this.estado,
            nuevoEstado,
            DateTime.now(),
            "Orden en Preparación",
            this.clienteId.getValue()
        )
        this.historialEstados.push(cambioEstado)
        this.estado = nuevoEstado;
    }

    public marcarEnviada(infoEnvio: InfoEnvio): void {
        if (this.estado != EstadoOrden.EN_PREPARACION) {
            throw new OrdenException(
                `Solo se puede como ${EstadoOrden.ENVIADA} si la orden está ${EstadoOrden.EN_PREPARACION}`
            )
        }

        this.infoEnvio = infoEnvio;

        const nuevoEstado = EstadoOrden.ENVIADA;
        const cambioEstado = CambioEstado.crear(
            this.estado,
            nuevoEstado,
            DateTime.now(),
            "Orden Enviada",
            this.clienteId.getValue()
        )
        this.historialEstados.push(cambioEstado)
        this.estado = nuevoEstado;
    }

    public marcarEntregada(): void {
        if ((this.estado !== EstadoOrden.ENVIADA) && (this.estado !== EstadoOrden.EN_TRANSITO)) {
            throw new OrdenException(
                `Solo se puede marcar ${EstadoOrden.ENTREGADA} si está ${EstadoOrden.ENVIADA} o ${EstadoOrden.EN_TRANSITO}`
            )
        }

        const nuevoEstado = EstadoOrden.ENTREGADA;
        const cambioEstado = CambioEstado.crear(
            this.estado,
            nuevoEstado,
            DateTime.now(),
            "Orden Entregada",
            this.clienteId.getValue()
        )
        this.historialEstados.push(cambioEstado)
        this.estado = nuevoEstado;
    }

    public cancelar(motivo: string): void {
        if ((this.estado === EstadoOrden.ENVIADA) || (this.estado === EstadoOrden.ENTREGADA)) {
            throw new OrdenException(
                `No se puede Cancelar una orden ya ${EstadoOrden.ENVIADA} o ${EstadoOrden.ENTREGADA}`
            )
        }

        if (!motivo || motivo.trim().length === 0) {
            throw new OrdenException(
                `Debe proporcionarse un motivo de cancelación`
            )
        }

        const MIN_NUM_CHARS = 10;
        if (motivo.trim().length < MIN_NUM_CHARS) {
            throw new OrdenException(
                `Debe proporcionarse un motivo de cancelación`
            )
        }

        const nuevoEstado = EstadoOrden.CANCELADA;
        const cambioEstado = CambioEstado.crear(
            this.estado,
            nuevoEstado,
            DateTime.now(),
            motivo,
            this.clienteId.getValue()
        )
        this.historialEstados.push(cambioEstado)
        this.estado = nuevoEstado;

    }

    public obtenerEstadoActual(): EstadoOrden {
        return this.estado;
    }

    public obtenerHistorial(): CambioEstado[] {
        return this.historialEstados;
    }
}