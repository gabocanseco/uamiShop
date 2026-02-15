import { UUID } from '@shared/domain/value-objects/uuid.vo';

export class ImagenId extends UUID {
  public static generar() {
    return new ImagenId(UUID.random());
  }

  public static of(id: string) {
    return new ImagenId(id);
  }
}
