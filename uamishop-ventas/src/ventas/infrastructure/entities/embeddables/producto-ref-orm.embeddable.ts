import { Column } from 'typeorm';

export class ProductoRefOrmEmbeddable {
    @Column('varchar', { name: 'producto_id', length: 36 })
    productoId!: string;

    @Column('varchar', { name: 'nombre', length: 150 })
    nombreProducto!: string;

    @Column('varchar', { name: 'sku', length: 50 })
    sku!: string;
}
