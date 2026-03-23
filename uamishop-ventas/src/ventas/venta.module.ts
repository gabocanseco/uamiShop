import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CarritoController } from '@ventas/controller/carrito.controller';
import { CarritoService } from '@ventas/service/carrito.service';
import { OrdenCreadaListener } from '@ventas/listeners/orden-creada.listener';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoOrmEntity } from '@ventas/infrastructure/entities/carrito-orm.entity';
import { ItemCarritoOrmEntity } from '@ventas/infrastructure/entities/item-carrito-orm.entity';
import { CarritoOrmRepository } from '@ventas/infrastructure/repositories/carrito-orm.repository';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CatalogoApiHttpClient } from '@ventas/infrastructure/api/catalogo-api-http-client';

/**
 * Módulo de Ventas
 * Gestiona todas las operaciones relacionadas con ventas
 */
@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([CarritoOrmEntity, ItemCarritoOrmEntity]),
  ],
  controllers: [CarritoController],
  providers: [
    {
      provide: 'DataSource',
      useValue: undefined,
    },
    CarritoService,
    {
      provide: 'ICarritoRepository',
      useClass: CarritoOrmRepository,
    },
    OrdenCreadaListener,
    {
      provide: 'CatalogoApi',
      useFactory: (
        httpService: HttpService,
        configService: ConfigService,
      ) => {
        const esCatalogoExterno =
          configService.get<string>('services.catalogoUrl') !== undefined;

        // Si se configura la URL del catálogo externo, usar el cliente HTTP; de lo contrario, usar el servicio local de productos
        return new CatalogoApiHttpClient(httpService, configService)
      },
      inject: [HttpService, ConfigService],
    },
  ],
  exports: [CarritoService, 'ICarritoRepository', 'CatalogoApi'],
})
export class VentaModule {}
