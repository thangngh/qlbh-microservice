import { Test, TestingModule } from '@nestjs/testing';
import { ProductBaseService } from './product-base.service';

describe('ProductBaseService', () => {
  let service: ProductBaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductBaseService],
    }).compile();

    service = module.get<ProductBaseService>(ProductBaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
