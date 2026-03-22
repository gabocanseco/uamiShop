import { Injectable } from '@nestjs/common';
import { ICategoriaRepository } from '@catalogo/repository/interfaces/categoria.repository';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';

@Injectable()
export class CategoriaInMemoryRepository implements ICategoriaRepository {
  private categorias: Categoria[] = [];

  async save(categoria: Categoria): Promise<void> {
    this.categorias.push(categoria);
  }

  async findById(id: CategoriaId): Promise<Categoria | null> {
    return (
      this.categorias.find((c) => c.getId().getValue() === id.getValue()) ||
      null
    );
  }

  async findAll(): Promise<Categoria[]> {
    return this.categorias;
  }

  async findByNombre(nombre: string): Promise<Categoria | null> {
    return this.categorias.find((c) => c.getNombre() === nombre) || null;
  }
  async update(categoria: Categoria): Promise<void> {
    const index = this.categorias.findIndex(
      (c) => c.getId().getValue() === categoria.getId().getValue(),
    );
    if (index !== -1) {
      this.categorias[index] = categoria;
    }
  }

  async delete(id: CategoriaId): Promise<void> {
    this.categorias = this.categorias.filter(
      (c) => c.getId().getValue() !== id.getValue(),
    );
  }
}
