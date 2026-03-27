import { CarritoId } from '@app/shared/domain/value-objects/ids/carrito-id.vo';
import { Carrito } from '@ventas/domain/agreggates/carrito.agreggate';

export interface ICarritoRepository {
  save(carrito: Carrito): Promise<void>;
  findById(id: CarritoId): Promise<Carrito | null>;
  findAll(): Promise<Carrito[]>;
  update(carrito: Carrito): Promise<void>;
  delete(id: CarritoId): Promise<void>;
}
