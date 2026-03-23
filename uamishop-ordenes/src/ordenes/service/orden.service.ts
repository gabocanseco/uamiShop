import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import { ResumenPago } from '@ordenes/domain/value-objects/resumen-pago.vo';
import type { IOrdenRepository } from '@ordenes/repository/interfaces/orden.repository';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { OrdenCreadaEvent } from '@shared/event/orden-creada.event';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { UUID } from '@shared/domain/value-objects/uuid.vo';
import { OrdenEventMapper } from './mappers/orden-event.mapper';
import { ORDEN_REPOSITORY } from '@ordenes/domain/constants';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGES } from '@shared/rabbitmq/constants/exchanges.const';
import {
  RK_ORDEN_CREADA,
  RK_PRODUCTO_COMPRADO,
} from '@shared/rabbitmq/constants/routing-keys.const';
import type { VentasApi } from './external_services/ventas/interfaces/ventas.api';
import { Transactional } from '@shared/decorators/transactional.decorator';
import { DataSource } from 'typeorm';

@Injectable()
export class OrdenService {
  dataSource: DataSource;

  constructor(
    @Inject(ORDEN_REPOSITORY)
    private readonly ordenRepository: IOrdenRepository,
    @Inject('VentasApi')
    private readonly ventasApi: VentasApi,
    private readonly eventEmitter: EventEmitter2,
    private readonly amqpConnection: AmqpConnection,
    @Inject('DataSource')
    dataSource: DataSource,
  ) {
    this.dataSource = dataSource;
  }

  @Transactional()
  async crear(nuevaOrden: Orden): Promise<Orden> {
    await this.ordenRepository.save(nuevaOrden);

    // Publicar eventos
    const productoCompradoEvent =
      OrdenEventMapper.toProductoCompradoEvent(nuevaOrden);
    this.eventEmitter.emit('orden.producto.comprado', productoCompradoEvent);
    this.amqpConnection.publish(
      EXCHANGES.UAMISHOP_EVENTS,
      RK_PRODUCTO_COMPRADO,
      productoCompradoEvent,
    );

    const ordenCreadaEvent = new OrdenCreadaEvent(
      UUID.random(),
      DateTime.now().getValue().toISOString(),
      nuevaOrden.getId().getValue(),
      nuevaOrden.toPrimitives().clienteId,
    );

    this.eventEmitter.emit('orden.creada', ordenCreadaEvent);
    this.amqpConnection.publish(
      EXCHANGES.UAMISHOP_EVENTS,
      RK_ORDEN_CREADA,
      ordenCreadaEvent,
    );

    return nuevaOrden;
  }

  @Transactional()
  async crearDesdeCarrito(
    carritoId: CarritoId,
    direccionEnvio: DireccionEnvio,
    resumenPago: ResumenPago,
  ): Promise<Orden> {
    const carritoResumenDto =
      await this.ventasApi.obtenerResumenCarrito(carritoId);

    const nuevaOrden = Orden.crearDesdeCarritoResumen(
      carritoResumenDto,
      direccionEnvio,
      resumenPago,
    );

    await this.ordenRepository.save(nuevaOrden);

    // Publicar evento ProductoCompradoEvent con sus items

    const productoCompradoEvent =
      OrdenEventMapper.toProductoCompradoEvent(nuevaOrden);
    this.eventEmitter.emit('orden.producto.comprado', productoCompradoEvent);
    this.amqpConnection.publish(
      EXCHANGES.UAMISHOP_EVENTS,
      RK_PRODUCTO_COMPRADO,
      productoCompradoEvent,
    );

    //evento  OrdenCreadaEvent
    const ordenCreadaEvent = new OrdenCreadaEvent(
      UUID.random(),
      DateTime.now().getValue().toISOString(),
      nuevaOrden.getId().getValue(),
      nuevaOrden.toPrimitives().clienteId,
      carritoId.getValue(),
    );
    this.eventEmitter.emit('orden.creada', ordenCreadaEvent);
    this.amqpConnection.publish(
      EXCHANGES.UAMISHOP_EVENTS,
      RK_ORDEN_CREADA,
      ordenCreadaEvent,
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

  @Transactional()
  async confirmar(ordenId: OrdenId): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.confirmar();

    await this.ordenRepository.update(orden);

    return orden;
  }

  @Transactional()
  async procesarPago(ordenId: OrdenId, referenciaPago: string): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.procesarPago(referenciaPago);

    await this.ordenRepository.update(orden);

    return orden;
  }

  @Transactional()
  async marcarEnProceso(ordenId: OrdenId): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.marcarEnProceso();

    await this.ordenRepository.update(orden);

    return orden;
  }

  @Transactional()
  async marcarEnviada(ordenId: OrdenId, infoEnvio: InfoEnvio): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.marcarEnviada(infoEnvio);

    await this.ordenRepository.update(orden);

    return orden;
  }

  @Transactional()
  async marcarEntregada(ordenId: OrdenId): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.marcarEntregada();

    await this.ordenRepository.update(orden);

    return orden;
  }

  @Transactional()
  async cancelar(ordenId: OrdenId, motivo: string): Promise<Orden> {
    const orden = await this.buscarPorId(ordenId);

    orden.cancelar(motivo);

    await this.ordenRepository.update(orden);

    return orden;
  }
}
