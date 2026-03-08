import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CarritoService } from '@ventas/service/carrito.service';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { OrdenCreadaDesdeCarritoEvent } from '@shared/event/orden-creada-desde-carrito.event';

/**
 * Listener que marca el carrito como COMPLETADO
 * cuando Órdenes crea una orden a partir de ese carrito.
 */
@Injectable()
export class OrdenCreadaDesdeCarritoListener {
  constructor(private readonly carritoService: CarritoService) {}

  @OnEvent('orden.creada-desde-carrito', { async: true })
  async onOrdenCreadaDesdeCarrito(event: OrdenCreadaDesdeCarritoEvent) {
    const carritoId = CarritoId.of(event.carritoId);
    await this.carritoService.completarCheckout(carritoId);
  }
}
