import { Inject, Injectable } from '@nestjs/common';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import type { IOrdenRepository } from '@ordenes/repository/interfaces/orden.repository';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';

@Injectable()
export class OrdenService {
  constructor(
    @Inject('IOrdenRepository')
    private readonly ordenRepository: IOrdenRepository,
    // private readonly carritoService: CarritoService,
  ) {}

  async crear(nuevaOrden: Orden): Promise<Orden> {
    await this.ordenRepository.save(nuevaOrden);
    return nuevaOrden;
  }

  // async crearDesdeCarrito(
  //   carritoId: CarritoId,
  //   direccionEnvio: DireccionEnvio,
  // ): Promise<Orden> {
  //   const datosCarrito = await this.carritoService.toPrimitives(carritoId);

  //   const nuevaOrden = Orden.crearDesdeCarritoResumen(ca);

  //   await this.ordenRepository.save(nuevaOrden);

  //   // Completar checkout del carrito
  //   const carritoCompletado =
  //     await this.carritoService.completarCheckout(carritoId);

  //   if (!carritoCompletado) {
  //     throw new BusinessRuleException(
  //       `No se pudo completar el Checkout del carrito ${carritoId.getValue()}`,
  //     );
  //   }

  //   return nuevaOrden;
  // }

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
