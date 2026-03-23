import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { ProductoCompradoEvent } from '@shared/event/producto-comprado.event';
import { EXCHANGES } from '@shared/rabbitmq/constants/exchanges.const';
import { QUEUE_CATALOGO_PRODUCTO_COMPRADO } from '@shared/rabbitmq/constants/queues.const';
import { RK_PRODUCTO_COMPRADO } from '@shared/rabbitmq/constants/routing-keys.const';
import { Transactional } from '@shared/decorators/transactional.decorator';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductoCompradoListener {
  dataSource: DataSource;

  constructor(
    private readonly productoEstadisticasService: ProductoEstadisticasService,
    @Inject('DataSource')
    dataSource: DataSource,
  ) {
    this.dataSource = dataSource;
  }

  @OnEvent('producto.comprado', { async: true }) // Escuchar el evento 'orden.producto.comprado' de forma asíncrona
  @RabbitSubscribe({
    exchange: EXCHANGES.UAMISHOP_EVENTS, // Nombre del exchange
    routingKey: RK_PRODUCTO_COMPRADO, // Routing key para filtrar los mensajes
    queue: QUEUE_CATALOGO_PRODUCTO_COMPRADO, // Nombre de la cola donde se recibirán los mensajes
  })
  @Transactional()
  async onProductoComprado(productoCompradoEvent: ProductoCompradoEvent) {
    productoCompradoEvent.items.forEach((item) => {
      this.productoEstadisticasService.registrarVenta(
        ProductoId.of(item.productoId),
        item.cantidad,
      );
    });
  }
}
