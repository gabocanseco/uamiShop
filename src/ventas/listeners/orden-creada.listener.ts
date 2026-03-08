import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CarritoService } from '@ventas/service/carrito.service';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { OrdenCreadaEvent } from '@shared/event/orden-creada.event';

/**
 * Listener que marca el carrito como COMPLETADO
 * cuando recibe el evento OrdenCreadaEvent.
 */
@Injectable()
export class OrdenCreadaListener {
    constructor(private readonly carritoService: CarritoService) { }

    @OnEvent('orden.creada', { async: true })
    async onOrdenCreada(event: OrdenCreadaEvent) {
        const carritoId = CarritoId.of(event.carritoId);
        await this.carritoService.completarCheckout(carritoId);
    }
}
