import { UUID } from '@app/shared/domain/value-objects/uuid.vo';

export class CarritoId extends UUID {
  public static generar() {
    return new CarritoId(UUID.random());
  }

  public static of(id: string) {
    return new CarritoId(id);
  }
}
