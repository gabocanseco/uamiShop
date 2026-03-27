import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductoRepository } from '@catalogo/repository/interfaces/producto.repository';
import { ProductoOrmEntity } from '@catalogo/infrastructure/persistence/entities/producto-orm.entity';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { ProductoOrmMapper } from '../mappers/producto-orm.mapper';

@Injectable()
export class ProductoOrmRepository implements IProductoRepository {
  constructor(
    @InjectRepository(ProductoOrmEntity)
    private readonly repository: Repository<ProductoOrmEntity>,
  ) {}

  async save(producto: Producto): Promise<void> {
    const ormEntity = ProductoOrmMapper.toOrm(producto);
    await this.repository.save(ormEntity);
  }

  async findById(id: ProductoId): Promise<Producto | undefined> {
    const ormEntity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return ormEntity ? ProductoOrmMapper.toDomain(ormEntity) : undefined;
  }

  async findAll(): Promise<Producto[]> {
    const ormEntities = await this.repository.find();
    return ormEntities.map((entity) => ProductoOrmMapper.toDomain(entity));
  }

  async update(producto: Producto): Promise<void> {
    const ormEntity = ProductoOrmMapper.toOrm(producto);
    await this.repository.save(ormEntity);
  }

  async delete(id: ProductoId): Promise<void> {
    await this.repository.delete(id.getValue());
  }
}
