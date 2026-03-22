import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { UUID } from '@shared/domain/value-objects/uuid.vo';
import { ProductoAgregadoAlCarritoEvent } from '@shared/event/producto-agregado-al-carrito.event';
import { Carrito } from '@ventas/domain/agreggates/carrito.agreggate';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';

export class CarritoEventMapper {
  static toProductoAgregadoAlCarritoEvent(
    productoRef: ProductoRef,
    carrito: Carrito,
    cantidad: number,
    precioUnitario: Money,
  ): ProductoAgregadoAlCarritoEvent {
    return new ProductoAgregadoAlCarritoEvent(
      UUID.random(),
      DateTime.now().getValue().toISOString(),
      productoRef.getProductoId().getValue(),
      carrito.getId().getValue(),
      cantidad,
      precioUnitario.getCantidad(),
      precioUnitario.getMoneda(),
    );
  }
}
