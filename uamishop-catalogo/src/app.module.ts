import { Module, Global } from '@nestjs/common';
import { CatalogoModule } from '@catalogo/catalogo.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
