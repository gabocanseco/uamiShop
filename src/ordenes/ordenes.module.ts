import { Module } from '@nestjs/common';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenController } from '@ordenes/controller/orden.controller';
import { OrdenInMemoryRepository } from '@ordenes/repository/orden-in-memory.repository';

@Module({
  providers: [
    OrdenService,
    {
      provide: 'IOrdenRepository',
      useClass: OrdenInMemoryRepository,
    },
  ],
  controllers: [OrdenController],
})
export class OrdenesModule {}
