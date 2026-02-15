import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id';

export interface IProductoRepository {
  save(producto: Producto): Promise<void>;
  findById(id: ProductoId): Promise<Producto | null>;
  findAll(): Promise<Producto[]>;
  update(producto: Producto): Promise<void>;
  delete(id: ProductoId): Promise<void>;
}
