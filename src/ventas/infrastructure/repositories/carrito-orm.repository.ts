import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICarritoRepository } from '@ventas/repository/interfaces/carrito.repository';
import { Carrito } from '@ventas/domain/agreggates/carrito.agreggate';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';

import { CarritoOrmEntity } from '../entities/carrito-orm.entity';
import { CarritoOrmMapper } from '../mappers/carrito-orm.mapper';

@Injectable()
export class CarritoOrmRepository implements ICarritoRepository {

    constructor(
        @InjectRepository(CarritoOrmEntity)
        private readonly repository: Repository<CarritoOrmEntity>,
    ) { }

    async save(carrito: Carrito): Promise<void> {
        const entity = CarritoOrmMapper.toPersistance(carrito);
        await this.repository.save(entity);
    }

    async findById(id: CarritoId): Promise<Carrito | null> {
        const entity = await this.repository.findOne({
            where: { id: id.getValue() },
        });

        if (!entity) return null;

        return CarritoOrmMapper.toDomain(entity);
    }

    async findAll(): Promise<Carrito[]> {
        const entities = await this.repository.find();
        return entities.map(CarritoOrmMapper.toDomain);
    }

    async update(carrito: Carrito): Promise<void> {
        const entity = CarritoOrmMapper.toPersistance(carrito);
        await this.repository.save(entity);
    }

    async delete(id: CarritoId): Promise<void> {
        await this.repository.delete(id.getValue());
    }

    async findByClienteId(clienteId: ClienteId): Promise<Carrito | null> {
        const entity = await this.repository.findOne({
            where: { clienteId: clienteId.getValue() },
        });

        if (!entity) return null;

        return CarritoOrmMapper.toDomain(entity);
    }
}