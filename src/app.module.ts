import { Module } from '@nestjs/common';
import { CatalogoModule } from '@catalogo/catalogo.module';
import { OrdenesModule } from '@ordenes/ordenes.module';
import { VentaModule } from '@ventas/venta.module';

@Module({
  imports: [CatalogoModule, OrdenesModule, VentaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
