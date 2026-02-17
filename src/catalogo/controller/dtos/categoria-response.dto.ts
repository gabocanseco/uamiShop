import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';

export class CategoriaResponseDto {
  id!: string;
  nombre!: string;
  descripcion!: string;
  categoriaPadreId?: string;

  public static fromDomain(categoria: Categoria): CategoriaResponseDto {
    const categoriaPrimitivos = categoria.toPrimitives();

    const response = new CategoriaResponseDto();
    response.id = categoriaPrimitivos.id;
    response.nombre = categoriaPrimitivos.nombre;
    response.descripcion = categoriaPrimitivos.descripcion;
    response.categoriaPadreId = categoriaPrimitivos.categoriaPadreId;
    return response;
  }
}
