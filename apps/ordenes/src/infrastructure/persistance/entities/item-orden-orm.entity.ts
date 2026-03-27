import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { OrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/orden-orm.entity';
import { MoneyOrmEmbeddable } from '@app/shared/infrastructure/persistance/embeddables/money-orm.embeddable';

@Entity('items_orden')
export class ItemOrdenOrmEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column('varchar', { name: 'producto_id', length: 36 })
  productoId!: string;

  @Column('varchar', { name: 'nombre_producto', length: 255 })
  nombreProducto!: string;

  @Column('varchar', { name: 'sku', length: 100 })
  sku!: string;

  @Column('int', { name: 'cantidad' })
  cantidad!: number;

  @Column(() => MoneyOrmEmbeddable, { prefix: 'precio_unitario_' })
  precioUnitario!: MoneyOrmEmbeddable;

  @Column(() => MoneyOrmEmbeddable, { prefix: 'subtotal_' })
  subtotal!: MoneyOrmEmbeddable;

  // Relación con OrdenOrmEntity
  @ManyToOne(() => OrdenOrmEntity, (orden) => orden.items)
  orden!: OrdenOrmEntity;
}
