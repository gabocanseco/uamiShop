import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { DateTime } from '@app/shared/domain/value-objects/datetime.vo';
import { UUID } from '@app/shared/domain/value-objects/uuid.vo';
import {
  ItemComprado,
  ProductoCompradoEvent,
} from '@app/shared/event/producto-comprado.event';

export class OrdenEventMapper {
  static toProductoCompradoEvent(orden: Orden): ProductoCompradoEvent {
    const primitives = orden.toPrimitives();

    return new ProductoCompradoEvent(
      UUID.random(), // Generar un nuevo UUID para el evento
      DateTime.now().getValue().toISOString(),
      primitives.id,
      primitives.clienteId,
      primitives.items.map(
        (item) =>
          new ItemComprado(
            item.productoId,
            item.sku,
            item.cantidad,
            item.precioUnitario.cantidad,
            item.precioUnitario.moneda,
          ),
      ),
    );
  }
}
