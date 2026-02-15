import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { ProductoException } from '../exceptions/producto.exception';

describe('Nombre Prodcuto Value Object', () => {
  describe('Creación', () => {
    it('El nombre del producto debe tener mínimo 3 caracteres', () => {
      expect(() => {
        NombreProducto.crear('ab');
      }).toThrow(ProductoException);
    });

    it('El nombre del producto debe tener máximo 100 caracteres', () => {
      expect(() => {
        NombreProducto.crear('a'.repeat(101));
      }).toThrow(ProductoException);
    });
  });
});
