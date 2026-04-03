import { Module } from '@nestjs/common';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenController } from '@ordenes/controller/orden.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { OrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/orden-orm.entity';
import { ItemOrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/item-orden-orm.entity';
import { CambioEstadoOrmEntity } from '@ordenes/infrastructure/persistance/embeddables/cambio-estado-orm.embeddable';
import { ORDEN_REPOSITORY } from './domain/constants';
import { OrdenOrmRepository } from './infrastructure/persistance/repositories/orden-orm.repository';
import { VentasApiHttpClient } from './infrastructure/api/ventas-api-http-client';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DomainException, EXCHANGES, SharedRabbitModule } from '@app/shared';
import { EventEmitterModule } from '@nestjs/event-emitter';
import databaseConfig from '@catalogo/config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import servicesConfig from './config/services.config';
import { OutboxModule } from '@app/shared/outbox/outbox.module';
import { ResilienceModule } from '@app/shared/infrastructure/resilience/circuit-breaker/circuit-breaker.module';

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
      OrdenOrmEntity,
      ItemOrdenOrmEntity,
      CambioEstadoOrmEntity,
    ]),
    SharedRabbitModule.register(EXCHANGES.UAMISHOP_EVENTS),
    EventEmitterModule.forRoot(),
    OutboxModule,
    ResilienceModule.register('VENTAS'),
  ],
  providers: [
    OrdenService,
    {
      provide: ORDEN_REPOSITORY,
      useClass: OrdenOrmRepository,
    },
    {
      provide: 'VentasApi',
      useClass: VentasApiHttpClient,
      // useFactory: (httpService: HttpService, configService: ConfigService) => {
      //   configService.get<string>('services.ventasUrl');

      //   // Si se configura la URL del catálogo externo, usar el cliente HTTP; de lo contrario, usar el servicio local de productos
      //   return new VentasApiHttpClient(httpService, configService);
      // },
      // inject: [HttpService, ConfigService],
    },
  ],
  controllers: [OrdenController],
})
export class OrdenesModule {}
