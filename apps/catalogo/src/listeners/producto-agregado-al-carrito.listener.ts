import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { ProductoAgregadoAlCarritoEvent } from '@app/shared/event/producto-agregado-al-carrito.event';
import { EXCHANGES } from '@app/shared/rabbitmq/constants/exchanges.const';
import { QUEUE_CATALOGO_PRODUCTO_AGREGADO } from '@app/shared/rabbitmq/constants/queues.const';
import { RK_PRODUCTO_AGREGADO } from '@app/shared/rabbitmq/constants/routing-keys.const';
import { Propagation, Transactional } from 'typeorm-transactional';

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
  @Transactional({ propagation: Propagation.REQUIRES_NEW }) // Asegura que cada evento se maneje en una transacción separada
  async onProductoAgregadoAlCarrito(
    productoAgregadoAlCarritoEvent: ProductoAgregadoAlCarritoEvent,
  ) {
    await this.productoEstadisticasService.registrarAgregadoAlCarrito(
      ProductoId.of(productoAgregadoAlCarritoEvent.productoId),
    );
  }
}
