import { UUID } from '@app/shared/domain/value-objects/uuid.vo';

export class OutboxEventId extends UUID {
  public static generar() {
    return new OutboxEventId(UUID.random());
  }

  public static of(id: string) {
    return new OutboxEventId(id);
  }
}
