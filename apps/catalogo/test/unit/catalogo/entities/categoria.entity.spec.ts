import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { describe, expect, it } from 'vitest';

describe('Categoria (agregado)', () => {
  it('crear genera un id y persiste nombre y descripcion', () => {
    const c = Categoria.crear('Hogar', 'Articulos del hogar');

    expect(c.getId()).toBeDefined();
    expect(c.getNombre()).toBe('Hogar');
    expect(c.getDescripcion()).toBe('Articulos del hogar');
    expect(c.getCategoriaPadreId()).toBeUndefined();
  });

  it('crear opcionalmente recibe categoria padre', () => {
    const padre = Categoria.crear('Padre', 'Cat padre');
    const hija = Categoria.crear('Hija', 'Sub', padre.getId());

    expect(hija.getCategoriaPadreId()?.getValue()).toBe(padre.getId().getValue());
  });

  it('actualizar cambia nombre y descripcion', () => {
    const c = Categoria.crear('A', 'Desc A');
    c.actualizar('B', 'Desc B');

    expect(c.getNombre()).toBe('B');
    expect(c.getDescripcion()).toBe('Desc B');
  });

  it('asignarPadre establece el padre', () => {
    const c = Categoria.crear('Hija', 'Sin padre');
    const padre = Categoria.crear('Padre', 'P');
    c.asignarPadre(padre.getId());

    expect(c.getCategoriaPadreId()?.getValue()).toBe(padre.getId().getValue());
  });

  it('reconstruct conserva el id y datos', () => {
    const id = CategoriaId.generar();
    const padre = CategoriaId.generar();
    const c = Categoria.reconstruct(
      id,
      'Nombre',
      'Descripcion',
      padre,
    );

    expect(c.getId().getValue()).toBe(id.getValue());
    expect(c.toPrimitives()).toEqual({
      id: id.getValue(),
      nombre: 'Nombre',
      descripcion: 'Descripcion',
      categoriaPadreId: padre.getValue(),
    });
  });

  it('toPrimitives sin padre expone categoriaPadreId undefined', () => {
    const c = Categoria.crear('Sola', 'Sin arbol');
    expect(c.toPrimitives().categoriaPadreId).toBeUndefined();
  });
});
