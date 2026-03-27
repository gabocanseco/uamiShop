import { BadRequestException } from '@nestjs/common';
import { ValueObjectIdPipe } from '@app/shared/controller/pipes/value-object-id.pipe';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock de un Value Object Id para la prueba
class MockId {
  constructor(readonly value: string) {}
  static of(value: string) {
    if (value === 'invalido') throw new Error('Formato erróneo');
    return new MockId(value);
  }
}

describe('ValueObjectIdPipe', () => {
  let pipe: ValueObjectIdPipe<MockId>;

  beforeEach(() => {
    pipe = new ValueObjectIdPipe(MockId);
  });

  it('debe transformar un string válido en una instancia del Value Object id', () => {
    const result = pipe.transform('123', {} as any);
    expect(result).toBeInstanceOf(MockId);
    expect(result.value).toBe('123');
  });

  it('debe lanzar BadRequestException si el método .of() falla', () => {
    expect(() => {
      pipe.transform('invalido', {} as any);
    }).toThrow(BadRequestException);
  });

  it('debe lanzar error si el valor es nulo o vacío', () => {
    expect(() => {
      pipe.transform('', {} as any);
    }).toThrow('ID no puede estar vacío');
  });
});
