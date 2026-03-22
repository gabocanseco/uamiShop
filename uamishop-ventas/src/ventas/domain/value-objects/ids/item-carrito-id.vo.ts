import { UUID } from '@shared/domain/value-objects/uuid.vo';

export class ItemCarritoId extends UUID {
  public static generar() {
    return new ItemCarritoId(UUID.random());
  }

  public static of(id: string) {
    return new ItemCarritoId(id);
  }
}
