import { Column } from 'typeorm';

export class DireccionEnvioOrmEmbeddable {
  @Column('varchar', { name: 'nombre_destinatario', length: 255 })
  nombreDestinatario!: string;

  @Column('varchar', { name: 'calle', length: 255 })
  calle!: string;

  @Column('varchar', { name: 'ciudad', length: 255 })
  ciudad!: string;

  @Column('varchar', { name: 'estado', length: 255 })
  estado!: string;

  @Column('varchar', { name: 'codigo_postal', length: 5 })
  codigoPostal!: string;

  @Column('varchar', { name: 'pais', length: 255 })
  pais!: string;

  @Column('varchar', { name: 'telefono', length: 10 })
  telefono!: string;

  @Column('varchar', { name: 'instrucciones', length: 255 })
  instrucciones!: string;
}
