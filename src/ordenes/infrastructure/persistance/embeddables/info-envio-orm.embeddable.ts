import { Column } from 'typeorm';

// Los campos son opcionales porque no todas las órdenes tendrán esta información, especialmente al momento de la creación.
// Se pueden actualizar posteriormente cuando se tenga la información de envío.
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
