import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrdenResumenDto } from '@ordenes/api/dtos/orden-resumen.dto';
import { OrdenesApi } from '@ordenes/api/interfaces/ordenes.api';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import { ResumenPago } from '@ordenes/domain/value-objects/resumen-pago.vo';
import type { IOrdenRepository } from '@ordenes/repository/interfaces/orden.repository';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { ProductoCompradoEvent } from '@shared/event/producto-comprado.event';
import { OrdenCreadaDesdeCarritoEvent } from '@shared/event/orden-creada-desde-carrito.event';
import type { VentasApi } from '@ventas/api/interfaces/ventas.api';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { UUID } from '@shared/domain/value-objects/uuid.vo';
import { OrdenEventMapper } from './mappers/orden-event.mapper';

@Injectable()
export class OrdenService implements OrdenesApi {
  constructor(
    @Inject('IOrdenRepository')
    private readonly ordenRepository: IOrdenRepository,
    @Inject('VentasApi')
    private readonly carritoService: VentasApi,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async crear(nuevaOrden: Orden): Promise<Orden> {
    await this.ordenRepository.save(nuevaOrden);
    return nuevaOrden;
  }

  async crearDesdeCarrito(
    carritoId: CarritoId,
    direccionEnvio: DireccionEnvio,
    resumenPago: ResumenPago,
  ): Promise<Orden> {
    const carritoResumenDto =
      await this.carritoService.obtenerResumenCarrito(carritoId);

    const nuevaOrden = Orden.crearDesdeCarritoResumen(
      carritoResumenDto,
      direccionEnvio,
      resumenPago,
    );

    await this.ordenRepository.save(nuevaOrden);

    // Publicar evento ProductoCompradoEvent con sus items
    this.eventEmitter.emit(
      'orden.producto.comprado',
      OrdenEventMapper.toProductoCompradoEvent(nuevaOrden),
    );

    // Publicar evento para que Ventas marque el carrito como COMPLETADO
    this.eventEmitter.emit(
      'orden.creada-desde-carrito',
      new OrdenCreadaDesdeCarritoEvent(
        UUID.random(),
        DateTime.now().getValue(),
        nuevaOrden.getId().getValue(),
        carritoId.getValue(),
      ),
    );

    return nuevaOrden;
  }

  async buscarPorId(ordenId: OrdenId): Promise<Orden> {
    const orden = await this.ordenRepository.findById(ordenId);
    if (!orden) {
      throw new EntityNotFoundException('Orden', ordenId.getValue());
    }

    return orden;
  }

  async buscarTodas(): Promise<Orden[]> {
    const ordenes = await this.ordenRepository.findAll();

    return ordenes;
  }

  async confirmar(ordenId: OrdenId): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.confirmar();

    await this.ordenRepository.update(orden);

    return orden;
  }

  async procesarPago(ordenId: OrdenId, referenciaPago: string): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.procesarPago(referenciaPago);

    await this.ordenRepository.update(orden);

    return orden;
  }

  async marcarEnProceso(ordenId: OrdenId): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.marcarEnProceso();

    await this.ordenRepository.update(orden);

    return orden;
  }

  async marcarEnviada(ordenId: OrdenId, infoEnvio: InfoEnvio): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.marcarEnviada(infoEnvio);

    await this.ordenRepository.update(orden);

    return orden;
  }

  async marcarEntregada(ordenId: OrdenId): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.marcarEntregada();

    await this.ordenRepository.update(orden);

    return orden;
  }

  async cancelar(ordenId: OrdenId, motivo: string): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.cancelar(motivo);

    await this.ordenRepository.update(orden);

    return orden;
  }
}
