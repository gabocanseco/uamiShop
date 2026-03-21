import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoService } from '@catalogo/service/producto.service';
import { ProductoController } from '@catalogo/controller/producto.controller';
import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { ProductoAgregadoAlCarritoListener } from '@catalogo/listeners/producto-agregado-al-carrito.listener';
import { ProductoCompradoListener } from '@catalogo/listeners/producto-comprado.listener';

import { ProductoOrmEntity } from '@catalogo/infrastructure/persistence/entities/producto-orm.entity';
import { CategoriaOrmEntity } from '@catalogo/infrastructure/persistence/entities/categoria-orm.entity';
import { ProductoEstadisticasOrmEntity } from '@catalogo/infrastructure/persistence/entities/producto-estadisticas-orm.entity';

import { ProductoOrmRepository } from '@catalogo/infrastructure/persistence/repositories/producto-orm.repository';
import { CategoriaOrmRepository } from '@catalogo/infrastructure/persistence/repositories/categoria-orm.repository';
import { ProductoEstadisticasOrmRepository } from '@catalogo/infrastructure/persistence/repositories/producto-estadisticas-orm.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductoOrmEntity,
      CategoriaOrmEntity,
      ProductoEstadisticasOrmEntity,
    ]),
  ],
  providers: [
    ProductoService,
    ProductoEstadisticasService,
    ProductoAgregadoAlCarritoListener,
    ProductoCompradoListener,
    {
      provide: 'IProductoRepository',
      useClass: ProductoOrmRepository,
    },
    {
      provide: 'ICategoriaRepository',
      useClass: CategoriaOrmRepository,
    },
    {
      provide: 'IProductoEstadisticasRepository',
      useClass: ProductoEstadisticasOrmRepository,
    },
  ],
  controllers: [ProductoController],
  exports: [ProductoService],
})
export class CatalogoModule {}
