import { Money } from '@app/shared/domain/value-objects/money.vo';

export class MoneyMapper {
  static toDomain(cantidad: number, moneda?: string): Money {
    return Money.crear(cantidad, moneda);
  }
}
