import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { describe, it, expect } from 'vitest';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';

describe('Descripción Prodcuto Value Object', () => {
  describe('Creación', () => {
    it('La descripción del producto no puede exceder los 500 caracteres', () => {
      expect(() => {
        DescripcionProducto.crear('a'.repeat(501));
      }).toThrow(BusinessRuleException);
    });
  });
});
