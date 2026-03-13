import { Column } from 'typeorm';
import { EstadoPago } from '@ordenes/domain/enums/estado-pago.enum';

export class ResumenPagoOrmEmbeddable {
  @Column('varchar', { name: 'metodo_pago', length: 255 })
  metodoPago!: string;

  @Column('varchar', {
    name: 'estado',
    length: 20,
    default: EstadoPago.PENDIENTE,
  })
  estado!: EstadoPago;

  @Column('varchar', {
    name: 'referencia_externa',
    length: 255,
    nullable: true,
  })
  referenciaExterna!: string | null;

  @Column('date', { name: 'fecha_procesamiento', nullable: true })
  fechaProcesamiento!: Date | null;
}
