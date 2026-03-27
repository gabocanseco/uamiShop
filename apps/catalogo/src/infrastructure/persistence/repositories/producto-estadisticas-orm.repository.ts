import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductoEstadisticasRepository } from '@catalogo/repository/interfaces/producto-estadisticas.repository';
import { ProductoEstadisticasOrmEntity } from '../entities/producto-estadisticas-orm.entity';
import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { ProductoEstadisticasOrmMapper } from '../mappers/producto-estadisticas-orm.mapper';

@Injectable()
export class ProductoEstadisticasOrmRepository implements IProductoEstadisticasRepository {
  constructor(
    @InjectRepository(ProductoEstadisticasOrmEntity)
    private readonly repository: Repository<ProductoEstadisticasOrmEntity>,
  ) {}

  async save(
    productoEstadisticas: ProductoEstadisticas,
  ): Promise<ProductoEstadisticas> {
    const ormEntity = ProductoEstadisticasOrmMapper.toOrm(productoEstadisticas);
    const savedEntity = await this.repository.save(ormEntity);
    return ProductoEstadisticasOrmMapper.toDomain(savedEntity);
  }

  async findByProductoId(
    productoId: ProductoId,
  ): Promise<ProductoEstadisticas | null> {
    const ormEntity = await this.repository.findOne({
      where: { productoId: productoId.getValue() },
    });
    return ormEntity ? ProductoEstadisticasOrmMapper.toDomain(ormEntity) : null;
  }

  async findMasVendidos(limit: number): Promise<ProductoEstadisticas[]> {
    const ormEntities = await this.repository.find({
      order: { cantidadVendida: 'DESC' },
      take: limit,
    });
    return ormEntities.map((entity) =>
      ProductoEstadisticasOrmMapper.toDomain(entity),
    );
  }
}
