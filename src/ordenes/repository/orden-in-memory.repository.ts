import { Injectable } from '@nestjs/common';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { IOrdenRepository } from '@ordenes/repository/interfaces/orden.repository';

@Injectable()
export class OrdenInMemoryRepository implements IOrdenRepository {
  private ordenes: Orden[] = [];

  async save(orden: Orden): Promise<void> {
    this.ordenes.push(orden);
  }

  async findById(id: OrdenId): Promise<Orden | null> {
    return (
      this.ordenes.find((o) => o.getId().getValue() === id.getValue()) || null
    );
  }

  async findAll(): Promise<Orden[]> {
    return this.ordenes;
  }

  async update(orden: Orden): Promise<void> {
    const index = this.ordenes.findIndex(
      (c) => c.getId().getValue() === orden.getId().getValue(),
    );
    if (index !== -1) {
      this.ordenes[index] = orden;
    }
  }

  async delete(id: OrdenId): Promise<void> {
    this.ordenes = this.ordenes.filter(
      (c) => c.getId().getValue() !== id.getValue(),
    );
  }
}
