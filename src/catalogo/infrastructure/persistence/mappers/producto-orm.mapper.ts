import { ProductoOrmEntity } from '../entities/producto-orm.entity';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { Disponible } from '@catalogo/domain/value-objects/disponible.vo';
import { Imagen } from '@catalogo/domain/value-objects/imagen';
import { ImagenId } from '@catalogo/domain/value-objects/ids/imagen-id.vo';
import { MoneyOrmMapper } from '@shared/infrastructure/persistance/mappers/money-orm.mapper';

export class ProductoOrmMapper {
    static toDomain(ormEntity: ProductoOrmEntity): Producto {
        const producto = Producto.crear(
            NombreProducto.crear(ormEntity.nombre),
            DescripcionProducto.crear(ormEntity.descripcion),
            MoneyOrmMapper.toDomain(ormEntity.precio),
            CategoriaId.of(ormEntity.categoriaId),
        );

        Reflect.set(producto, 'id', ProductoId.of(ormEntity.id));
        Reflect.set(
            producto,
            'disponible',
            ormEntity.disponible ? Disponible.creaDisponible() : Disponible.creaNoDisponible()
        );
        Reflect.set(producto, 'fechaCreacion', DateTime.crear(ormEntity.fechaCreacion));

        const imagenes = (ormEntity.imagenes || []).map((img) =>
            Imagen.crear(ImagenId.of(img.id), img.url, img.alt, img.orden)
        );
        Reflect.set(producto, 'imagenes', imagenes);

        return producto;
    }

    static toOrm(domainEntity: Producto): ProductoOrmEntity {
        const ormEntity = new ProductoOrmEntity();
        const primitives = domainEntity.toPrimitives();

        ormEntity.id = primitives.id;
        ormEntity.nombre = primitives.nombre;
        ormEntity.descripcion = primitives.descripcion;
        ormEntity.precio = MoneyOrmMapper.toPersistance(domainEntity.getPrecio());
        ormEntity.categoriaId = primitives.categoriaId;
        ormEntity.disponible = primitives.disponible;
        ormEntity.fechaCreacion = primitives.fechaCreacion;
        ormEntity.imagenes = primitives.imagenes;

        return ormEntity;
    }
}
