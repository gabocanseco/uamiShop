import { UUID } from '@shared/domain/value-objects/uuid.vo';

export class ItemOrdenId extends UUID {
  public static generar() {
    return new ItemOrdenId(UUID.random());
  }

  public static of(id: string) {
    return new ItemOrdenId(id);
  }
}
