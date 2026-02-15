import { UUID } from '@shared/domain/value-objects/uuid.vo';

export class CategoriaId extends UUID {
  public static generar() {
    return new CategoriaId(UUID.random());
  }

  public static of(id: string) {
    return new CategoriaId(id);
  }
}
