import { ProductoEstadisticasOrmEntity } from '../entities/producto-estadisticas-orm.entity';
import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';

export class ProductoEstadisticasOrmMapper {

    static toDomain(
        ormEntity: ProductoEstadisticasOrmEntity
    ): ProductoEstadisticas {

        return ProductoEstadisticas.reconstruct(
            ProductoId.of(ormEntity.productoId),
            ormEntity.ventasTotales,
            ormEntity.cantidadVendida,
            ormEntity.vecesAgregadoAlCarrito,
            DateTime.crear(ormEntity.ultimaVentaAt),
            DateTime.crear(ormEntity.ultimaAgregadoAlCarritoAt),
        );
    }

    static toOrm(
        domainEntity: ProductoEstadisticas
    ): ProductoEstadisticasOrmEntity {

        const ormEntity = new ProductoEstadisticasOrmEntity();

        ormEntity.productoId = domainEntity.getProductoId().getValue();
        ormEntity.ventasTotales = domainEntity.getVentasTotales();
        ormEntity.cantidadVendida = domainEntity.getCantidadVendida();
        ormEntity.vecesAgregadoAlCarrito = domainEntity.getVecesAgregadoAlCarrito();
        ormEntity.ultimaVentaAt = domainEntity.getUltimaVentaAt().getValue();
        ormEntity.ultimaAgregadoAlCarritoAt =
            domainEntity.getUltimaAgregadoAlCarritoAt().getValue();

        return ormEntity;
    }
}