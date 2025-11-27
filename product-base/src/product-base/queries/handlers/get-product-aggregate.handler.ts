import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProductAggregateQuery } from '../impl/product-aggregate.queries';
import { ProductAggregateView } from '../../views/product-aggregate.view';

@QueryHandler(GetProductAggregateQuery)
export class GetProductAggregateHandler implements IQueryHandler<GetProductAggregateQuery> {
  constructor(
    @InjectRepository(ProductAggregateView)
    private readonly productAggregateRepository: Repository<ProductAggregateView>,
  ) { }

  async execute(query: GetProductAggregateQuery): Promise<ProductAggregateView | null> {
    return this.productAggregateRepository.findOne({
      where: { id: query.productId },
    });
  }
}
