import { v4 as uuid, validate } from 'uuid';

export abstract class UUID {
  protected constructor(protected readonly value: string) {
    if (!validate(value)) throw new Error('Invalid UUID');
  }

  static random(): string {
    return uuid();
  }

  static generar() {}

  static of(id: string) {}

  public getValue(): string {
    return this.value;
  }

  public equals(other: UUID): boolean {
    if (other === null || other === undefined) return false;
    return this.value === other.getValue();
  }
}
