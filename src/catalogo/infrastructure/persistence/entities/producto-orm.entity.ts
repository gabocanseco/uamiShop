import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MoneyOrmEmbeddable } from '@shared/infrastructure/persistance/embeddables/money-orm.embeddable';

@Entity('productos')
export class ProductoOrmEntity {
    @PrimaryColumn('varchar', { name: 'id', length: 36 })
    id!: string;

    @Column('varchar', { name: 'nombre', length: 100 })
    nombre!: string;

    @Column('varchar', { name: 'descripcion', length: 500 })
    descripcion!: string;

    @Column(() => MoneyOrmEmbeddable, { prefix: 'precio_' })
    precio!: MoneyOrmEmbeddable;

    @Column('varchar', { name: 'categoria_id', length: 36 })
    categoriaId!: string;

    @Column('boolean', { name: 'disponible', default: false })
    disponible!: boolean;

    @Column('datetime', { name: 'fecha_creacion' })
    fechaCreacion!: Date;

    @Column('json', { name: 'imagenes', nullable: true })
    imagenes!: { id: string; url: string; alt: string; orden: number }[];
}
