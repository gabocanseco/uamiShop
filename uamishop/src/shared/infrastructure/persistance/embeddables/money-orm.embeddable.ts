import { Column } from 'typeorm';

export class MoneyOrmEmbeddable {
  @Column('decimal', { precision: 12, scale: 2, name: 'cantidad' })
  cantidad!: number;

  @Column('varchar', { length: 3, name: 'moneda' })
  moneda!: string;
}
