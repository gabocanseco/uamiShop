import { Module, Global } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import servicesConfig from './config/services.config';
import { OrdenesModule } from './ordenes/ordenes.module';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, servicesConfig],
      envFilePath: '.env',
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
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    OrdenesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
