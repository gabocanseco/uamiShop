import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';

export interface ICategoriaRepository {
  save(categoria: Categoria): Promise<void>;
  findById(id: CategoriaId): Promise<Categoria | null>;
  findAll(): Promise<Categoria[]>;
  findByNombre(nombre: string): Promise<Categoria | null>;
  update(categoria: Categoria): Promise<void>;
  delete(id: CategoriaId): Promise<void>;
}
