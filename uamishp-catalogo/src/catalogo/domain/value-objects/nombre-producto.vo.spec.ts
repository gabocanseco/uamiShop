import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { describe, it, expect } from 'vitest';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';

describe('Nombre Prodcuto Value Object', () => {
  describe('Creación', () => {
    it('El nombre del producto debe tener mínimo 3 caracteres', () => {
      expect(() => {
        NombreProducto.crear('ab');
      }).toThrow(BusinessRuleException);
    });

    it('El nombre del producto debe tener máximo 100 caracteres', () => {
      expect(() => {
        NombreProducto.crear('a'.repeat(101));
      }).toThrow(BusinessRuleException);
    });
  });
});
