import { Module } from '@nestjs/common';
import { CatalogoModule } from '@catalogo/catalogo.module';
import { OrdenesModule } from './ordenes/ordenes.module';

@Module({
  imports: [CatalogoModule, OrdenesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
