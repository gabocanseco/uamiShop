import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { ProductoException } from '../exceptions/producto.exception';

describe('Descripción Prodcuto Value Object', () => {
  describe('Creación', () => {
    it('La descripción del producto no puede exceder los 500 caracteres', () => {
      expect(() => {
        DescripcionProducto.crear('a'.repeat(501));
      }).toThrow(ProductoException);
    });
  });
});
