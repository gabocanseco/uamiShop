import { ItemOrden } from '@ordenes/domain/entities/item-orden.entity';
import { ItemOrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/item-orden-orm.entity';
import { ItemOrdenId } from '@ordenes/domain/value-objects/ids/item-orden-id.vo';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { MoneyOrmMapper } from '@app/shared/infrastructure/persistance/mappers/money-orm.mapper';

export class ItemOrdenOrmMapper {
  static toDomain(entity: ItemOrdenOrmEntity): ItemOrden {
    return ItemOrden.reconstruct({
      id: ItemOrdenId.of(entity.id),
      productoId: ProductoId.of(entity.productoId),
      nombreProducto: entity.nombreProducto,
      sku: entity.sku,
      cantidad: entity.cantidad,
      precioUnitario: MoneyOrmMapper.toDomain(entity.precioUnitario),
      subtotal: MoneyOrmMapper.toDomain(entity.subtotal),
    });
  }

  static toPersistance(item: ItemOrden): ItemOrdenOrmEntity {
    const entity = new ItemOrdenOrmEntity();
    entity.id = item.getId().getValue();
    entity.productoId = item.getProductoId().getValue();
    entity.nombreProducto = item.getNombreProducto();
    entity.sku = item.getSku();
    entity.cantidad = item.getCantidad();
    entity.precioUnitario = MoneyOrmMapper.toPersistance(
      item.getPrecioUnitario(),
    );
    entity.subtotal = MoneyOrmMapper.toPersistance(item.getSubtotal());
    return entity;
  }
}
