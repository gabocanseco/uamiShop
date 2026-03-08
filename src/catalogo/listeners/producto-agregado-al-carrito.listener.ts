import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { ProductoAgregadoAlCarritoEvent } from '@shared/event/producto-agregado-al-carrito.event';

@Injectable()
export class ProductoAgregadoAlCarritoListener {
  constructor(
    private readonly productoEstadisticasService: ProductoEstadisticasService,
  ) {}

  @OnEvent('carrito.producto.agregado', { async: true }) // Escuchar el evento de forma asíncrona
  async onProductoAgregadoAlCarrito(
    productoAgregadoAlCarritoEvent: ProductoAgregadoAlCarritoEvent,
  ) {
    this.productoEstadisticasService.registrarAgregadoAlCarrito(
      ProductoId.of(productoAgregadoAlCarritoEvent.productoId),
    );
  }
}
