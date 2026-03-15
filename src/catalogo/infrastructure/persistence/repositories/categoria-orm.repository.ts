import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICategoriaRepository } from '@catalogo/repository/interfaces/categoria.repository';
import { CategoriaOrmEntity } from '../entities/categoria-orm.entity';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { CategoriaOrmMapper } from '../mappers/categoria-orm.mapper';

@Injectable()
export class CategoriaOrmRepository implements ICategoriaRepository {
    constructor(
        @InjectRepository(CategoriaOrmEntity)
        private readonly repository: Repository<CategoriaOrmEntity>,
    ) { }

    async save(categoria: Categoria): Promise<void> {
        const ormEntity = CategoriaOrmMapper.toOrm(categoria);
        await this.repository.save(ormEntity);
    }

    async findById(id: CategoriaId): Promise<Categoria | null> {
        const ormEntity = await this.repository.findOne({
            where: { id: id.getValue() },
        });
        return ormEntity ? CategoriaOrmMapper.toDomain(ormEntity) : null;
    }

    async findAll(): Promise<Categoria[]> {
        const ormEntities = await this.repository.find();
        return ormEntities.map((entity) => CategoriaOrmMapper.toDomain(entity));
    }

    async findByNombre(nombre: string): Promise<Categoria | null> {
        const ormEntity = await this.repository.findOne({ where: { nombre } });
        return ormEntity ? CategoriaOrmMapper.toDomain(ormEntity) : null;
    }

    async update(categoria: Categoria): Promise<void> {
        const ormEntity = CategoriaOrmMapper.toOrm(categoria);
        await this.repository.save(ormEntity);
    }

    async delete(id: CategoriaId): Promise<void> {
        await this.repository.delete(id.getValue());
    }
}
