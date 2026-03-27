import { UUID } from '@app/shared/domain/value-objects/uuid.vo';

export class ClienteId extends UUID {
  public static generar() {
    return new ClienteId(UUID.random());
  }

  public static of(id: string) {
    return new ClienteId(id);
  }
}
