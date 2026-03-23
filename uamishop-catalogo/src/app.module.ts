import { Module } from '@nestjs/common';
import { CatalogoModule } from '@catalogo/catalogo.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RabbitMQConfigModule } from '@shared/rabbitmq/rabbitmq.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { addTransactionalDataSource } from 'typeorm-transactional';

@Module({
  imports: [
    RabbitMQConfigModule, // Importamos el módulo de configuración de RabbitMQ
    EventEmitterModule.forRoot(), // Habilita el motor de eventos globalmente
    CatalogoModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
