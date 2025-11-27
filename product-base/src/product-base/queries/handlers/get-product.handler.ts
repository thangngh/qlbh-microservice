import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductQuery } from '../impl/product.queries';
import { ProductBaseEntity } from '../../entities/product-base.entity';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @InjectRepository(ProductBaseEntity)
    private readonly productRepository: Repository<ProductBaseEntity>,
  ) { }

  async execute(query: GetProductQuery): Promise<ProductBaseEntity | null> {
    return this.productRepository.findOne({
      where: { id: query.productId, status: 'ACTIVE' },
    });
  }
}
