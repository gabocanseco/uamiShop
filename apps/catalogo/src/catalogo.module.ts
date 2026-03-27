import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ProductoService } from '@catalogo/service/producto.service';
import { ProductoController } from '@catalogo/controller/producto.controller';
import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { ProductoAgregadoAlCarritoListener } from '@catalogo/listeners/producto-agregado-al-carrito.listener';
import { ProductoCompradoListener } from '@catalogo/listeners/producto-comprado.listener';

import { ProductoOrmEntity } from '@catalogo/infrastructure/persistence/entities/producto-orm.entity';
import { CategoriaOrmEntity } from '@catalogo/infrastructure/persistence/entities/categoria-orm.entity';
import { ProductoEstadisticasOrmEntity } from '@catalogo/infrastructure/persistence/entities/producto-estadisticas-orm.entity';

import { ProductoOrmRepository } from '@catalogo/infrastructure/persistence/repositories/producto-orm.repository';
import { CategoriaOrmRepository } from '@catalogo/infrastructure/persistence/repositories/categoria-orm.repository';
import { ProductoEstadisticasOrmRepository } from '@catalogo/infrastructure/persistence/repositories/producto-estadisticas-orm.repository';
import { DomainException, EXCHANGES, SharedRabbitModule } from '@app/shared';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
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
    TypeOrmModule.forFeature([
      ProductoOrmEntity,
      CategoriaOrmEntity,
      ProductoEstadisticasOrmEntity,
    ]),
    SharedRabbitModule.register(EXCHANGES.UAMISHOP_EVENTS),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    ProductoService,
    ProductoEstadisticasService,
    ProductoAgregadoAlCarritoListener,
    ProductoCompradoListener,
    {
      provide: 'IProductoRepository',
      useClass: ProductoOrmRepository,
    },
    {
      provide: 'ICategoriaRepository',
      useClass: CategoriaOrmRepository,
    },
    {
      provide: 'IProductoEstadisticasRepository',
      useClass: ProductoEstadisticasOrmRepository,
    },
  ],
  controllers: [ProductoController],
  exports: [ProductoService],
})
export class CatalogoModule {}
