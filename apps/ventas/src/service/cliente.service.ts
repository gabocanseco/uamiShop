import { Injectable } from '@nestjs/common';
import { ClienteOrmRepository } from '@ventas/infrastructure/repositories/cliente-orm.repository';
import { ClienteOrmEntity } from '@ventas/infrastructure/entities/cliente-orm.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClienteService {
  constructor(private readonly clienteRepository: ClienteOrmRepository) {}

  async findOrCreate(id?: string): Promise<ClienteOrmEntity> {
    if (id) {
      return this.clienteRepository.findOrCreate(id);
    }
    const nuevoId = uuidv4();
    return this.clienteRepository.findOrCreate(nuevoId);
  }

  async findById(id: string): Promise<ClienteOrmEntity | null> {
    return this.clienteRepository.findById(id);
  }
}
