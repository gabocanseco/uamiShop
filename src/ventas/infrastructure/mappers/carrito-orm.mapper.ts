import { Carrito } from '@ventas/domain/agreggates/carrito.agreggate';
import { CarritoOrmEntity } from '@ventas/infrastructure/entities/carrito-orm.entity';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { ItemCarritoOrmMapper } from './item-carrito-orm.mapper';
import { Descuento } from '@ventas/domain/value-objects/descuento';
import { TipoDescuento } from '@ventas/domain/enums/tipo-descuento.enum';
import { Money } from '@shared/domain/value-objects/money.vo';
import { ItemCarrito } from '@ventas/domain/entities/item-carrito.entity';

export class CarritoOrmMapper {
    static toDomain(entity: CarritoOrmEntity): Carrito {
        const itemsMap = new Map<string, ItemCarrito>();
        if (entity.items) {
            entity.items.forEach((item) => {
                const itemDomain = ItemCarritoOrmMapper.toDomain(item);
                itemsMap.set(itemDomain.getProductoRef().getProductoId().getValue(), itemDomain);
            });
        }

        const descuentos: Descuento[] = [];
        if (entity.descuentos) {
            entity.descuentos.forEach((d: any) => {
                descuentos.push(
                    Descuento.reconstruct(
                        d.codigo,
                        d.tipo as TipoDescuento,
                        d.valor,
                        d.montoDescontado ? Money.crear(d.montoDescontado.cantidadDecimal, d.montoDescontado.codigoMoneda as string) : Money.cero()
                    )
                );
            });
        }

        return Carrito.reconstruct({
            id: CarritoId.of(entity.id),
            clienteId: ClienteId.of(entity.clienteId),
            items: itemsMap,
            descuentos: descuentos,
            estado: entity.estado,
            fechaCreacion: DateTime.crear(entity.fechaCreacion),
            fechaActualizacion: DateTime.crear(entity.fechaActualizacion),
        });
    }

    static toPersistance(carrito: Carrito): CarritoOrmEntity {
        const entity = new CarritoOrmEntity();
        const primitives = carrito.toPrimitives();

        entity.id = primitives.id;
        entity.clienteId = primitives.clienteId;
        entity.descuentos = primitives.descuentos;

        entity.items = carrito.getItems().map((item) => ItemCarritoOrmMapper.toPersistance(item));
        entity.estado = primitives.estado;
        entity.fechaCreacion = primitives.fechaCreacion;
        entity.fechaActualizacion = primitives.fechaActualizacion;

        return entity;
    }
}
