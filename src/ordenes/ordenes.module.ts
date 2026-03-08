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

@Module({
  imports: [VentaModule],
  providers: [
    OrdenService,
    {
      provide: 'IOrdenRepository',
      useClass: OrdenInMemoryRepository,
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
