import { Module } from '@nestjs/common';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenController } from '@ordenes/controller/orden.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/orden-orm.entity';
import { ItemOrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/item-orden-orm.entity';
import { CambioEstadoOrmEntity } from '@ordenes/infrastructure/persistance/embeddables/cambio-estado-orm.embeddable';
import { ORDEN_REPOSITORY } from './domain/constants';
import { OrdenOrmRepository } from './infrastructure/persistance/repositories/orden-orm.repository';
import { VentasApiHttpClient } from './infrastructure/api/ventas-api-http-client';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
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
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        const esCatalogoExterno =
          configService.get<string>('services.ventasUrl') !== undefined;

        // Si se configura la URL del catálogo externo, usar el cliente HTTP; de lo contrario, usar el servicio local de productos
        return new VentasApiHttpClient(httpService, configService);
      },
      inject: [HttpService, ConfigService],
    },
  ],
  controllers: [OrdenController],
})
export class OrdenesModule {}
