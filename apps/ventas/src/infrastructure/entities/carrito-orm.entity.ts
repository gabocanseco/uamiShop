import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ItemCarritoOrmEntity } from './item-carrito-orm.entity';
import { EstadoCarrito } from '@ventas/domain/enums/estado-carrito.enum';

@Entity('carritos')
export class CarritoOrmEntity {
  @PrimaryColumn('varchar', { name: 'id', length: 36 })
  id!: string;

  @Column('varchar', { name: 'cliente_id', length: 36 })
  clienteId!: string;

  @OneToMany(() => ItemCarritoOrmEntity, (item) => item.carrito, {
    cascade: true,
    eager: true,
  })
  items!: ItemCarritoOrmEntity[];

  @Column('json', { name: 'descuentos', nullable: true })
  descuentos?: any[];

  @Column('varchar', {
    name: 'estado',
    length: 20,
    default: EstadoCarrito.ACTIVO,
  })
  estado!: EstadoCarrito;

  @Column('datetime', { name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @Column('datetime', { name: 'fecha_actualizacion' })
  fechaActualizacion!: Date;
}
