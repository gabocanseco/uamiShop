import { Column } from 'typeorm';

export class InfoEnvioOrmEmbeddable {
  @Column('varchar', {
    name: 'proveedor_logistico',
    length: 100,
    nullable: true,
  })
  proveedorLogistico?: string;

  @Column('varchar', { name: 'numero_guia', length: 50, nullable: true })
  numeroGuia?: string | null;

  @Column('date', { name: 'fecha_estimada_entrega', nullable: true })
  fechaEtimadaEntrega?: Date;
}
