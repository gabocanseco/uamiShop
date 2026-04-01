import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';

export interface IProductoRepository {
  save(producto: Producto): Promise<void>;
  findById(id: ProductoId): Promise<Producto | undefined>;
  findAll(): Promise<Producto[]>;
  findByIds(ids: ProductoId[]): Promise<Producto[]>;
  update(producto: Producto): Promise<void>;
  delete(id: ProductoId): Promise<void>;
}
