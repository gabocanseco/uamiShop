import { UUID } from '@shared/domain/value-objects/uuid.vo';

export class OrdenId extends UUID {
  public static generar() {
    return new OrdenId(UUID.random());
  }

  public static of(id: string) {
    return new OrdenId(id);
  }
}
