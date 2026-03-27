import { Test, TestingModule } from '@nestjs/testing';
import { CatalogoController } from './catalogo.controller';
import { CatalogoService } from './catalogo.service';

describe('CatalogoController', () => {
  let catalogoController: CatalogoController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CatalogoController],
      providers: [CatalogoService],
    }).compile();

    catalogoController = app.get<CatalogoController>(CatalogoController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(catalogoController.getHello()).toBe('Hello World!');
    });
  });
});
