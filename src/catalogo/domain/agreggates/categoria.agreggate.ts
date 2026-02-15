import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';

export class Categoria {
  constructor(
    private readonly id: CategoriaId,
    private nombre: string,
    private descripcion: string,
    private categoriaPadreId: CategoriaId,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.categoriaPadreId = categoriaPadreId;
  }

  public actualizar(nombre: string, descripcion: string): void {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  public asignarPadre(categoriaPadreId: CategoriaId): void {
    this.categoriaPadreId = categoriaPadreId;
  }

  public getId(): CategoriaId {
    return this.id;
  }
}
