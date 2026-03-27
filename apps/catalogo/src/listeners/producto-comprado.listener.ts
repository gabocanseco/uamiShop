import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { ProductoCompradoEvent } from '@app/shared/event/producto-comprado.event';
import { EXCHANGES } from '@app/shared/rabbitmq/constants/exchanges.const';
import { QUEUE_CATALOGO_PRODUCTO_COMPRADO } from '@app/shared/rabbitmq/constants/queues.const';
import { RK_PRODUCTO_COMPRADO } from '@app/shared/rabbitmq/constants/routing-keys.const';
import { Propagation, Transactional } from 'typeorm-transactional';

@Injectable()
export class ProductoCompradoListener {
  constructor(
    private readonly productoEstadisticasService: ProductoEstadisticasService,
  ) {}

  @OnEvent('producto.comprado', { async: true }) // Escuchar el evento 'orden.producto.comprado' de forma asíncrona
  @RabbitSubscribe({
    exchange: EXCHANGES.UAMISHOP_EVENTS, // Nombre del exchange
    routingKey: RK_PRODUCTO_COMPRADO, // Routing key para filtrar los mensajes
    queue: QUEUE_CATALOGO_PRODUCTO_COMPRADO, // Nombre de la cola donde se recibirán los mensajes
  })
  @Transactional({ propagation: Propagation.REQUIRES_NEW }) // Asegura que cada evento se maneje en una transacción separada
  async onProductoComprado(productoCompradoEvent: ProductoCompradoEvent) {
    await Promise.all(
      productoCompradoEvent.items.map(async (item) => {
        await this.productoEstadisticasService.registrarVenta(
          ProductoId.of(item.productoId),
          item.cantidad,
        );
      }),
    );
  }
}
