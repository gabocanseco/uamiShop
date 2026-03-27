import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { CarritoOrmEntity } from './carrito-orm.entity';
import { MoneyOrmEmbeddable } from '@app/shared/infrastructure/persistance/embeddables/money-orm.embeddable';
import { ProductoRefOrmEmbeddable } from './embeddables/producto-ref-orm.embeddable';

@Entity('items_carrito')
export class ItemCarritoOrmEntity {
  @PrimaryColumn('varchar', { name: 'id', length: 36 })
  id!: string;

  @Column(() => ProductoRefOrmEmbeddable, { prefix: 'producto_ref_' })
  productoRef!: ProductoRefOrmEmbeddable;

  @Column('int', { name: 'cantidad' })
  cantidad!: number;

  @Column(() => MoneyOrmEmbeddable, { prefix: 'precio_unitario_' })
  precioUnitario!: MoneyOrmEmbeddable;

  @ManyToOne(() => CarritoOrmEntity, (carrito) => carrito.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'carrito_id' })
  carrito!: CarritoOrmEntity;
}
