import { EstadoOrden } from '@ordenes/domain/enums/estado-orden.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/orden-orm.entity';

@Entity('cambios_estado_orden')
export class CambioEstadoOrmEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column('varchar', {
    name: 'estado_nuevo',
    length: 20,
    default: EstadoOrden.PENDIENTE,
  })
  estadoNuevo!: EstadoOrden;

  @Column('datetime', { name: 'fecha' })
  fecha!: Date;

  @Column('varchar', { name: 'motivo', length: 255 })
  motivo!: string;

  @Column('varchar', { name: 'usuario', length: 36 })
  usuario!: string;

  @Column('varchar', {
    name: 'estado_anterior',
    length: 20,
    nullable: true,
  })
  estadoAnterior!: EstadoOrden | null;

  @ManyToOne(() => OrdenOrmEntity, (orden) => orden.historialEstados)
  orden!: OrdenOrmEntity;
}
