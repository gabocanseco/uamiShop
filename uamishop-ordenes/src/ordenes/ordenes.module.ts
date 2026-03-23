import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenController } from '@ordenes/controller/orden.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
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
    RabbitMQModule.forRoot({
      uri: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    TypeOrmModule.forFeature([
      OrdenOrmEntity,
      ItemOrdenOrmEntity,
      CambioEstadoOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: 'DataSource',
      useValue: undefined,
    },
    OrdenService,
    {
      provide: ORDEN_REPOSITORY,
      useClass: OrdenOrmRepository,
    },
    {
      provide: 'VentasApi',
      useFactory: (httpService: HttpService, configService: ConfigService) => {
        return new VentasApiHttpClient(httpService, configService);
      },
      inject: [HttpService, ConfigService],
    },
  ],
  controllers: [OrdenController],
})
export class OrdenesModule {}
