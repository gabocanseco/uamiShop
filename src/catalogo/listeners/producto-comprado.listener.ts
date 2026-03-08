import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { ProductoCompradoEvent } from '@shared/event/producto-comprado.event';

@Injectable()
export class ProductoCompradoListener {
  constructor(
    private readonly productoEstadisticasService: ProductoEstadisticasService,
  ) {}

  @OnEvent('orden.producto,comprado', { async: true }) // Escuchar el evento 'orden.productoComprado' de forma asíncrona
  async onProductoComprado(productoCompradoEvent: ProductoCompradoEvent) {
    productoCompradoEvent.items.forEach((item) => {
      this.productoEstadisticasService.registrarVenta(
        ProductoId.of(item.productoId),
        item.cantidad,
      );
    });
  }
}
