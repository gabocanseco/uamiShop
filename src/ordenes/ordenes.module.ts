import { Module } from '@nestjs/common';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenController } from '@ordenes/controller/orden.controller';
import { OrdenInMemoryRepository } from '@ordenes/repository/orden-in-memory.repository';
import { VentaModule } from '@ventas/venta.module';
import { CarritoService } from '@ventas/service/carrito.service';
import { ProductoCompradoListener } from '@catalogo/listeners/producto-comprado.listener';
import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { ProductoEstadisticasInMemoryRepository } from '@catalogo/repository/producto-estadisticas-in-memory-repository';
import { ProductoAgregadoAlCarritoListener } from '@catalogo/listeners/producto-agregado-al-carrito.listener';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { OrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/orden-orm.entity';
import { ItemOrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/item-orden-orm.entity';
import { CambioEstadoOrmEntity } from '@ordenes/infrastructure/persistance/embeddables/cambio-estado-orm.embeddable';
import { ORDEN_REPOSITORY } from './domain/constants';
import { OrdenOrmRepository } from './infrastructure/persistance/repositories/orden-orm.repository';

@Module({
  imports: [
    VentaModule,
    TypeOrmModule.forFeature([
      OrdenOrmEntity,
      ItemOrdenOrmEntity,
      CambioEstadoOrmEntity,
    ]),
  ],
  providers: [
    OrdenService,
    {
      provide: ORDEN_REPOSITORY,
      useClass: OrdenOrmRepository,
      // inject: [ConfigService, ModuleRef],
      // useFactory: (config: ConfigService, moduleRef: ModuleRef) => {
      //   if (config.get('NODE_ENV') === 'mysql') {
      //     const ormRepository = moduleRef.get(
      //       getRepositoryToken(OrdenOrmEntity),
      //       { strict: false },
      //     );
      //     return new OrdenOrmRepository(ormRepository);
      //   }
      //   return new OrdenInMemoryRepository();
      // },
    },
    {
      provide: 'VentasApi',
      useExisting: CarritoService, // Usar la instancia existente de CarritoService como VentasApi
    },
    ProductoEstadisticasService,
    {
      provide: 'IProductoEstadisticasRepository',
      useClass: ProductoEstadisticasInMemoryRepository,
    },
    ProductoCompradoListener,
    ProductoAgregadoAlCarritoListener,
  ],
  controllers: [OrdenController],
})
export class OrdenesModule {}
