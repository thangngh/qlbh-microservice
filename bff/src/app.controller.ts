import { Controller, Post, Body, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { OrchestratorSaga } from './saga/orchestrator.saga';
import { CreateProductAggregateDto } from './dto/create-product-aggregate.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly orchestratorSaga: OrchestratorSaga,
  ) { }

  @Post('product')
  async createProduct(@Body() body: CreateProductAggregateDto) {
    console.log('Received request to create product aggregate:', body);
    const transactionId = await this.orchestratorSaga.startSaga(body);
    return { transactionId, status: 'STARTED' };
  }
}
