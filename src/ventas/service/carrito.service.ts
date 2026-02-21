import { Injectable, Inject } from '@nestjs/common';
import type { ICarritoRepository } from '@ventas/repository/interfaces/carrito.repository';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { Carrito } from '@ventas/domain/agreggates/carrito';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

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
  async crear(clienteId: ClienteId): Promise<Carrito> {
    const nuevoCarrito = Carrito.crear(clienteId);

    await this.carritoRepository.save(nuevoCarrito);

    return nuevoCarrito;
  }

  /**
   * Obtiene un carrito por su ID
   */
  async obtenerCarrito(carritoId: CarritoId): Promise<Carrito> {
    const carrito = await this.carritoRepository.findById(carritoId);
    if (!carrito) {
      throw new BusinessRuleException(
        `Carrito con ID ${carritoId.getValue()} no encontrado`,
      );
    }
    return carrito;
  }

  /**
   * Agrega un producto al carrito
   */
  async agregarProducto(
    carritoId: CarritoId,
    productoRef: ProductoRef,
    cantidad: number,
    precioUnitario: Money,
  ): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(carritoId);

    carrito.agregarProducto(productoRef, cantidad, precioUnitario);

    await this.carritoRepository.update(carrito);

    return carrito;
  }

  /**
   * Modifica la cantidad de un producto en el carrito
   */
  async modificarCantidad(
    carritoId: CarritoId,
    productoId: ProductoId,
    nuevaCantidad: number,
  ): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(carritoId);

    carrito.modificarCantidad(productoId, nuevaCantidad);

    await this.carritoRepository.update(carrito);

    return carrito;
  }

  /**
   * Elimina un producto del carrito
   */
  async eliminarProducto(
    carritoId: CarritoId,
    productoId: ProductoId,
  ): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(carritoId);

    carrito.eliminarProducto(productoId);

    await this.carritoRepository.update(carrito);

    return carrito;
  }

  /**
   * Vacía el carrito eliminando todos los productos
   */
  async vaciar(carritoId: CarritoId): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(carritoId);

    carrito.vaciar();

    await this.carritoRepository.update(carrito);

    return carrito;
  }

  /**
   * Inicia el proceso de checkout del carrito
   */
  async iniciarCheckout(carritoId: CarritoId): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(carritoId);

    carrito.iniciarCheckout();

    await this.carritoRepository.update(carrito);

    return carrito;
  }

  /**
   * Completa el checkout del carrito
   */
  async completarCheckout(carritoId: CarritoId): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(carritoId);

    carrito.completarCheckout();

    await this.carritoRepository.update(carrito);

    return carrito;
  }

  /**
   * Marca el carrito como abandonado
   */
  async abandonar(carritoId: CarritoId): Promise<Carrito> {
    const carrito = await this.obtenerCarrito(carritoId);

    carrito.abandonar();

    await this.carritoRepository.update(carrito);

    return carrito;
  }
}
