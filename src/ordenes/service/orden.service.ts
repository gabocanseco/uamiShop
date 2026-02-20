import { Inject, Injectable } from '@nestjs/common';
import { OrdenRequestDto } from '@ordenes/controller/dtos/orden-request.dto';
import { OrdenResponseDto } from '@ordenes/controller/dtos/orden-response.dto';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenException } from '@ordenes/domain/exceptions/orden.exception';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import type { IOrdenRepository } from '@ordenes/repository/interfaces/orden.repository';
import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { CarritoService as CarritoService } from '@ventas/service/carrito.service';

@Injectable()
export class OrdenService {
  constructor(
    @Inject('IOrdenRepository')
    private readonly ordenRepository: IOrdenRepository,
    private readonly carritoService: CarritoService,
  ) {}

  // async crear(request: OrdenRequestDto): Promise<OrdenResponseDto> {
  //   // Construye DireccionEnvio e ItemOrden desde el request
  //   const clienteId = 0; // todo
  //   const items = 0;
  //   const direccionEnvio = 0;
  //   const resumenPagoPendiente = 0;
  //   const nuevaOrden = Orden.crear(
  //     clienteId,
  //     items,
  //     direccionEnvio,
  //     resumenPagoPendiente,
  //   );
  //   await this.ordenRepository.save(nuevaOrden);
  //   return OrdenResponseDto.fromDomain(nuevaOrden);
  // }

  // async crearDesdeCarrito(
  //   carritoId: CarritoId,
  //   direccionEnvio: DireccionEnvio,
  // ): Promise<OrdenResponseDto> {
  //   const carrito = await this.carritoService.obtenerCarrito(carritoId);
  //   if (!carrito) {
  //     throw new OrdenException(
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

  // async buscarPorId(id: OrdenId): Promise<OrdenResponseDto> {
  //   const orden = await this.obtenerOrdenPorId(id);

  //   return OrdenResponseDto.fromDomain(orden);
  // }

  // async buscarTodas(): Promise<OrdenResponseDto[]> {
  //   const ordenes = await this.ordenRepository.findAll();

  //   return ordenes.map((orden) => OrdenResponseDto.fromDomain(orden));
  // }

  // async confirmar(id: OrdenId): Promise<OrdenResponseDto> {
  //   const orden = await this.obtenerOrdenPorId(id);

  //   orden.confirmar();

  //   await this.ordenRepository.update(orden);

  //   return OrdenResponseDto.fromDomain(orden);
  // }

  // async procesarPago(
  //   id: OrdenId,
  //   referenciaPago: string,
  // ): Promise<OrdenResponseDto> {
  //   const orden = await this.obtenerOrdenPorId(id);

  //   orden.procesarPago(referenciaPago);

  //   await this.ordenRepository.update(orden);

  //   return OrdenResponseDto.fromDomain(orden);
  // }

  // async marcarEnProceso(id: OrdenId): Promise<OrdenResponseDto> {
  //   const orden = await this.obtenerOrdenPorId(id);

  //   orden.marcarEnProceso();

  //   await this.ordenRepository.update(orden);

  //   return OrdenResponseDto.fromDomain(orden);
  // }

  // async marcarEnviada(
  //   id: OrdenId,
  //   infoEnvio: InfoEnvio,
  // ): Promise<OrdenResponseDto> {
  //   const orden = await this.obtenerOrdenPorId(id);

  //   orden.marcarEnviada(infoEnvio);

  //   await this.ordenRepository.update(orden);

  //   return OrdenResponseDto.fromDomain(orden);
  // }

  // async marcarEntregada(id: OrdenId): Promise<OrdenResponseDto> {
  //   const orden = await this.obtenerOrdenPorId(id);

  //   orden.marcarEntregada();

  //   await this.ordenRepository.update(orden);

  //   return OrdenResponseDto.fromDomain(orden);
  // }

  // async cancelar(id: OrdenId, motivo: string): Promise<OrdenResponseDto> {
  //   const orden = await this.obtenerOrdenPorId(id);

  //   orden.cancelar(motivo);

  //   await this.ordenRepository.update(orden);

  //   return OrdenResponseDto.fromDomain(orden);
  // }

  // private async obtenerOrdenPorId(id: OrdenId): Promise<Orden> {
  //   const orden = await this.ordenRepository.findById(id);
  //   if (!orden) {
  //     throw new OrdenException(`Orden con ID ${id.getValue()} no encontrado`);
  //   }
  //   return orden;
  // }
}
