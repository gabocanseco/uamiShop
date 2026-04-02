import { Column, Entity, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('clientes')
export class ClienteOrmEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column('varchar', { length: 255, nullable: true })
  email?: string;

  @Column('varchar', { length: 255, nullable: true })
  nombre?: string;

  @Column('varchar', { length: 500, nullable: true })
  telefono?: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion!: Date;
}
