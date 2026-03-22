import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ItemOrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/item-orden-orm.entity';
import { EstadoOrden } from '@ordenes/domain/enums/estado-orden.enum';
import { ResumenPagoOrmEmbeddable } from '@ordenes/infrastructure/persistance/embeddables/resumen-pago-orm.embeddable';
import { DireccionEnvioOrmEmbeddable } from '@ordenes/infrastructure/persistance/embeddables/direccion-envio-orm.embeddable';
import { MoneyOrmEmbeddable } from '@shared/infrastructure/persistance/embeddables/money-orm.embeddable';
import { CambioEstadoOrmEntity } from '@ordenes/infrastructure/persistance/embeddables/cambio-estado-orm.embeddable';
import { InfoEnvioOrmEmbeddable } from '@ordenes/infrastructure/persistance/embeddables/info-envio-orm.embeddable';

@Entity('ordenes')
export class OrdenOrmEntity {
  @PrimaryColumn('varchar', { name: 'id', length: 36 })
  id!: string;

  @Column('varchar', { name: 'numero_orden', length: 50 })
  numeroOrden!: string;

  @Column('varchar', { name: 'cliente_id', length: 36 })
  clienteId!: string;

  @OneToMany(() => ItemOrdenOrmEntity, (item) => item.orden, {
    cascade: true,
    eager: true,
  })
  items!: ItemOrdenOrmEntity[];

  @Column(() => DireccionEnvioOrmEmbeddable, { prefix: 'direccion_envio_' })
  direccionEnvio!: DireccionEnvioOrmEmbeddable;

  @Column(() => ResumenPagoOrmEmbeddable, { prefix: 'resumen_pago_' })
  resumenPago!: ResumenPagoOrmEmbeddable;

  @Column(() => MoneyOrmEmbeddable, { prefix: 'subtotal_' })
  subtotal!: MoneyOrmEmbeddable;

  @Column(() => MoneyOrmEmbeddable, { prefix: 'descuento_' })
  descuento!: MoneyOrmEmbeddable;

  @Column(() => MoneyOrmEmbeddable, { prefix: 'total_' })
  total!: MoneyOrmEmbeddable;

  @Column('varchar', {
    name: 'estado',
    length: 20,
    default: EstadoOrden.PENDIENTE,
  })
  estado!: EstadoOrden;

  @Column('datetime', { name: 'fecha_creacion' })
  fechaCreacion!: Date;

  @OneToMany(() => CambioEstadoOrmEntity, (cambio) => cambio.orden, {
    cascade: true,
    eager: true,
  })
  historialEstados!: CambioEstadoOrmEntity[];

  @Column(() => InfoEnvioOrmEmbeddable, { prefix: 'info_envio_' })
  infoEnvio?: InfoEnvioOrmEmbeddable;
}
