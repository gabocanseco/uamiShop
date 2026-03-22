import { Money } from '@shared/domain/value-objects/money.vo';
import { MoneyOrmEmbeddable } from '../embeddables/money-orm.embeddable';

export class MoneyOrmMapper {
  static toDomain(entity: MoneyOrmEmbeddable): Money {
    return Money.crear(entity.cantidad, entity.moneda);
  }

  static toPersistance(money: Money): MoneyOrmEmbeddable {
    const entity = new MoneyOrmEmbeddable();
    entity.cantidad = money.getCantidad();
    entity.moneda = money.getMoneda();
    return entity;
  }
}
