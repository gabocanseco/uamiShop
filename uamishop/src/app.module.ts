import { Module } from '@nestjs/common';
import { OrdenesModule } from '@ordenes/ordenes.module';
import { VentaModule } from '@ventas/venta.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import servicesConfig from './config/services.config';
import { RabbitMQConfigModule } from '@shared/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    RabbitMQConfigModule, // Importamos el módulo de configuración de RabbitMQ
    EventEmitterModule.forRoot(), // Habilita el motor de eventos globalmente
    OrdenesModule,
    VentaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, servicesConfig],
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
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
