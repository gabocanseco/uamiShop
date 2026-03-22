import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { ProductoAgregadoAlCarritoEvent } from '@shared/event/producto-agregado-al-carrito.event';
import { EXCHANGES } from '@shared/rabbitmq/constants/exchanges.const';
import { QUEUE_CATALOGO_PRODUCTO_AGREGADO } from '@shared/rabbitmq/constants/queues.const';
import { RK_PRODUCTO_AGREGADO } from '@shared/rabbitmq/constants/routing-keys.const';

@Injectable()
export class ProductoAgregadoAlCarritoListener {
  constructor(
    private readonly productoEstadisticasService: ProductoEstadisticasService,
  ) {}

  @OnEvent('producto.agregado-carrito', { async: true }) // Escuchar el evento de forma asíncrona
  @RabbitSubscribe({
    exchange: EXCHANGES.UAMISHOP_EVENTS, // Nombre del exchange
    routingKey: RK_PRODUCTO_AGREGADO, // Routing key para filtrar los mensajes
    queue: QUEUE_CATALOGO_PRODUCTO_AGREGADO, // Nombre de la cola donde se recibirán los mensajes
  })
  async onProductoAgregadoAlCarrito(
    productoAgregadoAlCarritoEvent: ProductoAgregadoAlCarritoEvent,
  ) {
    this.productoEstadisticasService.registrarAgregadoAlCarrito(
      ProductoId.of(productoAgregadoAlCarritoEvent.productoId),
    );
  }
}
