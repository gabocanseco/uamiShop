import { Injectable, Inject } from '@nestjs/common';
import type { ICarritoRepository } from '@ventas/repository/interfaces/carrito.repository';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { CarritoResponseDto } from '@ventas/controller/dtos/carrito-response.dto';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { Carrito } from '@ventas/domain/agreggates/carrito';
import { VentaException } from '@ventas/domain/exceptions/venta.exception';

/**
 * Servicio de aplicación para gestionar carritos de compra
 */
@Injectable()
export class CarritoService {
  constructor(
    @Inject('ICarritoRepository')
    private readonly carritoRepository: ICarritoRepository,
  ) {}

  /**
   * Crea un carrito vacío asociado a un cliente
   */
  async crear(clienteId: ClienteId): Promise<CarritoResponseDto> {
    const nuevoCarrito = Carrito.crear(clienteId);
    await this.carritoRepository.save(nuevoCarrito);

    return CarritoResponseDto.fromDomain(nuevoCarrito);
  }

  /**
   * Obtiene un carrito por su ID
   */
  async obtenerCarrito(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);
    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Agrega un producto al carrito
   */
  async agregarProducto(
    carritoId: CarritoId,
    productoRef: ProductoRef,
    cantidad: number,
    precioUnitario: Money,
  ): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.agregarProducto(productoRef, cantidad, precioUnitario);

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Modifica la cantidad de un producto en el carrito
   */
  async modificarCantidad(
    carritoId: CarritoId,
    productoId: ProductoId,
    nuevaCantidad: number,
  ): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.modificarCantidad(productoId, nuevaCantidad);

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Elimina un producto del carrito
   */
  async eliminarProducto(
    carritoId: CarritoId,
    productoId: ProductoId,
  ): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.eliminarProducto(productoId);

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Vacía el carrito eliminando todos los productos
   */
  async vaciar(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.vaciar();

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Inicia el proceso de checkout del carrito
   */
  async iniciarCheckout(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.iniciarCheckout();

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Completa el checkout del carrito
   */
  async completarCheckout(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.completarCheckout();

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Marca el carrito como abandonado
   */
  async abandonar(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.abandonar();

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Método privado para obtener un carrito y lanzar excepción si no existe
   */
  private async obtenerCarritoPorId(id: CarritoId): Promise<Carrito> {
    const carrito = await this.carritoRepository.findById(id);
    if (!carrito) {
      throw new VentaException(`Carrito con ID ${id.getValue()} no encontrado`);
    }
    return carrito;
  }
}
