import { Module } from '@nestjs/common';
import { CarritoController } from '@ventas/controller/carrito.controller';
import { ClienteController } from '@ventas/controller/cliente.controller';
import { CarritoService } from '@ventas/service/carrito.service';
import { ClienteService } from '@ventas/service/cliente.service';
import { OrdenCreadaListener } from '@ventas/listeners/orden-creada.listener';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CarritoOrmEntity } from '@ventas/infrastructure/entities/carrito-orm.entity';
import { ItemCarritoOrmEntity } from '@ventas/infrastructure/entities/item-carrito-orm.entity';
import { ClienteOrmEntity } from '@ventas/infrastructure/entities/cliente-orm.entity';
import { CarritoOrmRepository } from '@ventas/infrastructure/repositories/carrito-orm.repository';
import { ClienteOrmRepository } from '@ventas/infrastructure/repositories/cliente-orm.repository';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatalogoApiHttpClient } from '@ventas/infrastructure/api/catalogo-api-http-client';
import { DomainException, EXCHANGES, SharedRabbitModule } from '@app/shared';
import { EventEmitterModule } from '@nestjs/event-emitter';
import databaseConfig from '@catalogo/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import servicesConfig from './config/services.config';
import { OutboxModule } from '@app/shared/outbox/outbox.module';

/**
 * Módulo de Ventas
 * Gestiona todas las operaciones relacionadas con ventas
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, servicesConfig],
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = process.env.NODE_ENV;

        if (nodeEnv == 'mysql') {
          const databaseProps = config.get<TypeOrmModuleOptions>('database');
          return databaseProps!;
        }

        return {
          type: 'sqlite',
          // database: 'db.sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
      dataSourceFactory: async (options?: DataSourceOptions) => {
        if (!options)
          throw new DomainException(
            'DataSourceOptions no es compatible con SQLite en este contexto',
          );
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    HttpModule,
    TypeOrmModule.forFeature([
      CarritoOrmEntity,
      ItemCarritoOrmEntity,
      ClienteOrmEntity,
    ]),
    SharedRabbitModule.register(EXCHANGES.UAMISHOP_EVENTS),
    EventEmitterModule.forRoot(),
    OutboxModule,
  ],
  controllers: [CarritoController, ClienteController],
  providers: [
    ClienteService,
    CarritoService,
    {
      provide: 'ICarritoRepository',
      useClass: CarritoOrmRepository,
    },
    ClienteOrmRepository,
    OrdenCreadaListener,
    {
      provide: 'CatalogoApi',
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        configService.get<string>('services.catalogoUrl');

        // Si se configura la URL del catálogo externo, usar el cliente HTTP; de lo contrario, usar el servicio local de productos
        return new CatalogoApiHttpClient(httpService, configService);
      },
      inject: [HttpService, ConfigService],
    },
  ],
  exports: [CarritoService, 'ICarritoRepository', 'CatalogoApi'],
})
export class VentaModule {}
