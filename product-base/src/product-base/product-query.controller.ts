import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetProductAggregateQuery, GetAllProductAggregatesQuery } from '../queries/impl/product-aggregate.queries';

@Controller('products')
export class ProductQueryController {
  constructor(private readonly queryBus: QueryBus) { }

  @Get()
  async getAllProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const query = new GetAllProductAggregatesQuery(Number(page), Number(limit));
    return this.queryBus.execute(query);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    const query = new GetProductAggregateQuery(id);
    return this.queryBus.execute(query);
  }
}
