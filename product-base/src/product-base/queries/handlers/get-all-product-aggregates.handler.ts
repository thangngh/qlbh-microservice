import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAllProductAggregatesQuery } from '../impl/product-aggregate.queries';
import { ProductAggregateView } from '../../views/product-aggregate.view';

@QueryHandler(GetAllProductAggregatesQuery)
export class GetAllProductAggregatesHandler implements IQueryHandler<GetAllProductAggregatesQuery> {
  constructor(
    @InjectRepository(ProductAggregateView)
    private readonly productAggregateRepository: Repository<ProductAggregateView>,
  ) { }

  async execute(query: GetAllProductAggregatesQuery): Promise<{ data: ProductAggregateView[]; total: number }> {
    const skip = (query.page - 1) * query.limit;

    const [data, total] = await this.productAggregateRepository.findAndCount({
      skip,
      take: query.limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total };
  }
}
