import { Module } from '@nestjs/common';
import { CarritoController } from '@ventas/controller/carrito.controller';
import { CarritoService } from '@ventas/service/carrito.service';
import { CarritoInMemoryRepository } from './repository/carrito-in-memory.repository';
import { OrdenCreadaDesdeCarritoListener } from '@ventas/listeners/orden-creada-desde-carrito.listener';

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
    OrdenCreadaDesdeCarritoListener,
  ],
  exports: [CarritoService, 'ICarritoRepository'],
})
export class VentaModule {}
