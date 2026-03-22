import { UUID } from '@shared/domain/value-objects/uuid.vo';

export class ProductoId extends UUID {
  public static generar() {
    return new ProductoId(UUID.random());
  }

  public static of(id: string) {
    return new ProductoId(id);
  }
}
