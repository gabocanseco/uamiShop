import { Module } from '@nestjs/common';
import { CatalogoModule } from '@catalogo/catalogo.module';
import { OrdenesModule } from '@ordenes/ordenes.module';
import { VentaModule } from '@ventas/venta.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    EventEmitterModule.forRoot(), // Habilita el motor de eventos globalmente
    CatalogoModule,
    OrdenesModule,
    VentaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // La lógica de decisión ahora vive dentro del Factory
        const databaseProps = config.get<TypeOrmModuleOptions>('database');

        // Si no estamos en modo mysql, devolvemos una config "dummy" o de memoria
        // para que los repositorios no crasheen al inyectarse
        if (process.env.NODE_ENV !== 'mysql') {
          return {
            type: 'sqlite',
            database: ':memory:',
            autoLoadEntities: true,
            synchronize: true,
          };
        }

        return databaseProps!;
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
