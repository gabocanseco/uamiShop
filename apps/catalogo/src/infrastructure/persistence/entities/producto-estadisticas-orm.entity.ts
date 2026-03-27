import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('producto_estadisticas')
export class ProductoEstadisticasOrmEntity {
  @PrimaryColumn('varchar', { name: 'producto_id', length: 36 })
  productoId!: string;

  @Column('int', { name: 'ventas_totales', default: 0 })
  ventasTotales!: number;

  @Column('int', { name: 'cantidad_vendida', default: 0 })
  cantidadVendida!: number;

  @Column('int', { name: 'veces_agregado_al_carrito', default: 0 })
  vecesAgregadoAlCarrito!: number;

  @Column('datetime', { name: 'ultima_venta_at', nullable: true })
  ultimaVentaAt!: Date;

  @Column('datetime', { name: 'ultima_agregado_al_carrito_at', nullable: true })
  ultimaAgregadoAlCarritoAt!: Date;
}
