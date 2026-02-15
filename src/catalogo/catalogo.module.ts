import { Module } from '@nestjs/common';
import { ProductoService } from '@catalogo/service/producto.service';
import { ProductoController } from '@catalogo/controller/producto.controller';
import { ProductoInMemoryRepository } from '@catalogo/repository/producto-in-memory.repository';
import { CategoriaInMemoryRepository } from '@catalogo/repository/categoria-in-memory.repository';

@Module({
  controllers: [ProductoController],
  providers: [
    {
      provide: 'IProductoRepository',
      useClass: ProductoInMemoryRepository,
    },
    {
      provide: 'ICategoriaRepository',
      useClass: CategoriaInMemoryRepository,
    },
    ProductoService,
  ],
})
export class CatalogoModule {}
