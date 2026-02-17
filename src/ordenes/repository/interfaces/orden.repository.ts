import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';

export interface IOrdenRepository {
  save(orden: Orden): Promise<void>;
  findById(id: OrdenId): Promise<Orden | null>;
  findAll(): Promise<Orden[]>;
  update(orden: Orden): Promise<void>;
  delete(id: OrdenId): Promise<void>;
}
