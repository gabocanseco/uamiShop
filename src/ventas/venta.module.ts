import { Module } from '@nestjs/common';
import { CarritoController } from '@ventas/controller/carrito.controller';
import { CarritoService } from '@ventas/service/carrito.service';
import { CarritoInMemoryRepository } from './repository/carrito-in-memory.repository';
import { OrdenCreadaListener } from './listeners/orden-creada.listener';

/**
 * Módulo de Ventas
 * Gestiona todas las operaciones relacionadas con ventas
 */
@Module({
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
export class VentaModule { }
