import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClienteOrmEntity } from '../entities/cliente-orm.entity';

@Injectable()
export class ClienteOrmRepository {
  constructor(
    @InjectRepository(ClienteOrmEntity)
    private readonly repository: Repository<ClienteOrmEntity>,
  ) {}

  async create(cliente: ClienteOrmEntity): Promise<ClienteOrmEntity> {
    return this.repository.save(cliente);
  }

  async findById(id: string): Promise<ClienteOrmEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findOrCreate(id: string): Promise<ClienteOrmEntity> {
    let cliente = await this.findById(id);
    if (!cliente) {
      cliente = this.repository.create({
        id,
        nombre: 'Cliente Anónimo',
      });
      await this.repository.save(cliente);
    }
    return cliente;
  }
}
