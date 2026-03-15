import { Module } from '@nestjs/common';
import { CarritoController } from '@ventas/controller/carrito.controller';
import { CarritoService } from '@ventas/service/carrito.service';
import { CarritoInMemoryRepository } from './repository/carrito-in-memory.repository';
import { OrdenCreadaListener } from './listeners/orden-creada.listener';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoOrmEntity } from './infrastructure/entities/carrito-orm.entity';
import { ItemCarritoOrmEntity } from './infrastructure/entities/item-carrito-orm.entity';

/**
 * Módulo de Ventas
 * Gestiona todas las operaciones relacionadas con ventas
 */
@Module({
  imports: [TypeOrmModule.forFeature([CarritoOrmEntity, ItemCarritoOrmEntity])],
  controllers: [CarritoController],
  providers: [
    CarritoService,
    {
      provide: 'ICarritoRepository',
      useClass: CarritoInMemoryRepository,
    },
    OrdenCreadaListener,
  ],
  exports: [CarritoService, 'ICarritoRepository'],
})
export class VentaModule {}
