import { Module } from '@nestjs/common';
import { ProductoService } from '@catalogo/service/producto.service';
import { ProductoController } from '@catalogo/controller/producto.controller';
import { ProductoInMemoryRepository } from '@catalogo/repository/producto-in-memory.repository';
import { CategoriaInMemoryRepository } from '@catalogo/repository/categoria-in-memory.repository';
import { ProductoEstadisticasInMemoryRepository } from '@catalogo/repository/producto-estadisticas-in-memory-repository';

import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { ProductoAgregadoAlCarritoListener } from '@catalogo/listeners/producto-agregado-al-carrito.listener';
import { ProductoCompradoListener } from '@catalogo/listeners/producto-comprado.listener';

@Module({
  providers: [
    ProductoService,
    ProductoEstadisticasService,
    ProductoAgregadoAlCarritoListener,
    ProductoCompradoListener,
    {
      provide: 'IProductoRepository',
      useClass: ProductoInMemoryRepository,
    },
    {
      provide: 'ICategoriaRepository',
      useClass: CategoriaInMemoryRepository,
    },
    {
      provide: 'IProductoEstadisticasRepository',
      useClass: ProductoEstadisticasInMemoryRepository,
    },
  ],
  controllers: [ProductoController],
})
export class CatalogoModule { }
