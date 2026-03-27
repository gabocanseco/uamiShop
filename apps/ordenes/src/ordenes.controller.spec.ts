import { Test, TestingModule } from '@nestjs/testing';
import { OrdenesController } from './ordenes.controller';
import { OrdenesService } from './ordenes.service';

describe('OrdenesController', () => {
  let ordenesController: OrdenesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdenesController],
      providers: [OrdenesService],
    }).compile();

    ordenesController = app.get<OrdenesController>(OrdenesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ordenesController.getHello()).toBe('Hello World!');
    });
  });
});
