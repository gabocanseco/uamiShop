import { Injectable } from '@nestjs/common';
import { ICarritoRepository } from './interfaces/carrito.repository';
import { Carrito } from '@ventas/domain/agreggates/carrito';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';

@Injectable()
export class CarritoInMemoryRepository implements ICarritoRepository {
  private carritos: Carrito[] = [];

  async save(carrito: Carrito): Promise<void> {
    this.carritos.push(carrito);
  }

  async findById(id: CarritoId): Promise<Carrito | null> {
    return (
      this.carritos.find((c) => c.getId().getValue() === id.getValue()) || null
    );
  }

  async findAll(): Promise<Carrito[]> {
    return this.carritos;
  }

  async update(carrito: Carrito): Promise<void> {
    const index = this.carritos.findIndex(
      (c) => c.getId().getValue() === carrito.getId().getValue(),
    );
    if (index !== -1) {
      this.carritos[index] = carrito;
    }
  }

  async delete(id: CarritoId): Promise<void> {
    this.carritos = this.carritos.filter(
      (c) => c.getId().getValue() !== id.getValue(),
    );
  }
}
