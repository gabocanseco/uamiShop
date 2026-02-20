import { Injectable } from '@nestjs/common';
import { IProductoRepository } from '@catalogo/repository/interfaces/producto.repository';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

@Injectable()
export class ProductoInMemoryRepository implements IProductoRepository {
  private productos: Producto[] = [];

  async save(producto: Producto): Promise<void> {
    // verificar que el id de la categoriapadre exista si es dado
    this.productos.push(producto);
  }

  async findById(id: ProductoId): Promise<Producto | undefined> {
    return (
      this.productos.find((p) => p.getId().getValue() === id.getValue()) ||
      undefined
    );
  }

  async findAll(): Promise<Producto[]> {
    return this.productos;
  }

  async update(producto: Producto): Promise<void> {
    const index = this.productos.findIndex(
      (p) => p.getId().getValue() === producto.getId().getValue(),
    );
    if (index !== -1) {
      this.productos[index] = producto;
    }
  }

  async delete(id: ProductoId): Promise<void> {
    this.productos = this.productos.filter(
      (p) => p.getId().getValue() !== id.getValue(),
    );
  }
}
