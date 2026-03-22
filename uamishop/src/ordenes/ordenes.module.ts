import { Module } from '@nestjs/common';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenController } from '@ordenes/controller/orden.controller';
import { VentaModule } from '@ventas/venta.module';
import { CarritoService } from '@ventas/service/carrito.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    },
    {
      provide: 'VentasApi',
      useExisting: CarritoService,
    },
  ],
  controllers: [OrdenController],
})
export class OrdenesModule {}
