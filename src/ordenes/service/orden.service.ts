import { Inject, Injectable } from '@nestjs/common';
// import { OrdenRequestDto } from '@ordenes/controller/dtos/orden-request.dto';
// import { OrdenResponseDto } from '@ordenes/controller/dtos/orden-response.dto';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import type { IOrdenRepository } from '@ordenes/repository/interfaces/orden.repository';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
// import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
// import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
// import { CarritoService as CarritoService } from '@ventas/service/carrito.service';

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
  // ): Promise<OrdenResponseDto> {
  //   const carrito = await this.carritoService.obtenerCarrito(carritoId);
  //   if (!carrito) {
  //     throw new EntityNotFoundException(
  //       'Orden',
  //       `Carrito con ID ${carritoId.getValue()} no encontrado`,
  //     );
  //   }

  //   // Convertir items a ItemOrden
  //   const items = 0;

  //   // crear la Orden
  //   const clienteId = 0;
  //   const resumenPago = 0;

  //   const nuevaOrden = Orden.crear(
  //     clienteId,
  //     items,
  //     direccionEnvio,
  //     resumenPago,
  //   );

  //   await this.ordenRepository.save(nuevaOrden);

  //   // Completar checkout del carrito
  //   const carritoCompletado = this.carritoService.completarCheckout(carritoId);

  //   if (!carritoCompletado) {
  //     throw new OrdenException(
  //       `No se pudo completar el Checkout del carrito ${carritoId.getValue()}`,
  //     );
  //   }

  //   return OrdenResponseDto.fromDomain(nuevaOrden);
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
