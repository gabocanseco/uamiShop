import { ItemCarrito } from '@ventas/domain/entities/item-carrito.entity';
import { ItemCarritoOrmEntity } from '@ventas/infrastructure/entities/item-carrito-orm.entity';
import { ItemCarritoId } from '@ventas/domain/value-objects/ids/item-carrito-id.vo';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { MoneyOrmMapper } from '@app/shared/infrastructure/persistance/mappers/money-orm.mapper';

export class ItemCarritoOrmMapper {
  static toDomain(entity: ItemCarritoOrmEntity): ItemCarrito {
    return ItemCarrito.reconstruct({
      id: ItemCarritoId.of(entity.id),
      productoRef: ProductoRef.crear(
        ProductoId.of(entity.productoRef.productoId),
        entity.productoRef.nombreProducto,
        entity.productoRef.sku,
      ),
      cantidad: entity.cantidad,
      precioUnitario: MoneyOrmMapper.toDomain(entity.precioUnitario),
    });
  }

  static toPersistance(item: ItemCarrito): ItemCarritoOrmEntity {
    const entity = new ItemCarritoOrmEntity();
    entity.id = item.getId().getValue();

    // TypeORM Embeddable mapped via simple object structure assignment
    entity.productoRef = {
      productoId: item.getProductoRef().getProductoId().getValue(),
      nombreProducto: item.getProductoRef().getNombreProducto(),
      sku: item.getProductoRef().getSku(),
    };

    entity.cantidad = item.getCantidad();
    entity.precioUnitario = MoneyOrmMapper.toPersistance(
      item.getPrecioUnitario(),
    );

    return entity;
  }
}
