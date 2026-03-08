import { Module } from '@nestjs/common';
import { ProductoService } from '@catalogo/service/producto.service';
import { ProductoController } from '@catalogo/controller/producto.controller';
import { ProductoInMemoryRepository } from '@catalogo/repository/producto-in-memory.repository';
import { CategoriaInMemoryRepository } from '@catalogo/repository/categoria-in-memory.repository';
import { ProductoEstadisticasInMemoryRepository } from '@catalogo/repository/producto-estadisticas-in-memory-repository';

@Module({
  providers: [
    ProductoService,
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
export class CatalogoModule {}
