import { Injectable } from '@nestjs/common';
import { IOrdenRepository } from '@ordenes/repository/interfaces/orden.repository';
import { Repository } from 'typeorm';
import { OrdenOrmEntity } from '../entities/orden-orm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenOrmMapper } from '@ordenes/infrastructure/persistance/mappers/orden-orm.mapper';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';

@Injectable()
export class OrdenOrmRepository implements IOrdenRepository {
  constructor(
    @InjectRepository(OrdenOrmEntity)
    private readonly repository: Repository<OrdenOrmEntity>,
  ) {}

  async save(orden: Orden): Promise<void> {
    const entity = OrdenOrmMapper.toPersistance(orden);
    await this.repository.save(entity);
  }

  async findById(id: OrdenId): Promise<Orden | null> {
    const entity = await this.repository.findOne({
      where: { id: id.getValue() },
    });
    return entity ? OrdenOrmMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Orden[]> {
    const entities = await this.repository.find();
    return entities.map((entity) => OrdenOrmMapper.toDomain(entity));
  }

  async delete(id: OrdenId): Promise<void> {
    await this.repository.delete({ id: id.getValue() });
  }

  async update(orden: Orden): Promise<void> {
    const entity = OrdenOrmMapper.toPersistance(orden);
    await this.repository.save(entity);
  }
}
