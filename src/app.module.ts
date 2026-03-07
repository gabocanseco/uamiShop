import { Module } from '@nestjs/common';
import { CatalogoModule } from '@catalogo/catalogo.module';
import { OrdenesModule } from '@ordenes/ordenes.module';
import { VentaModule } from '@ventas/venta.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(), // Habilita el motor de eventos globalmente
    CatalogoModule,
    OrdenesModule,
    VentaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
