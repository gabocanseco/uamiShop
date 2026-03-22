import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('categorias')
export class CategoriaOrmEntity {
    @PrimaryColumn('varchar', { name: 'id', length: 36 })
    id!: string;

    @Column('varchar', { name: 'nombre', length: 150 })
    nombre!: string;

    @Column('varchar', { name: 'descripcion', length: 500, nullable: true })
    descripcion!: string;

    @Column('varchar', { name: 'categoria_padre_id', length: 36, nullable: true })
    categoriaPadreId?: string;
}
