import { Test, TestingModule } from '@nestjs/testing';
import { ProductBaseController } from './product-base.controller';
import { ProductBaseService } from './product-base.service';

describe('ProductBaseController', () => {
  let controller: ProductBaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductBaseController],
      providers: [ProductBaseService],
    }).compile();

    controller = module.get<ProductBaseController>(ProductBaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
