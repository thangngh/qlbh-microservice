import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload, ClientKafka } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { ProductBaseService } from './product-base.service';
import { KAFKA_CLIENT, TOPIC_CREATE_PRODUCT_COMMAND, TOPIC_ROLLBACK_PRODUCT_COMMAND } from '../constants';
import { CreateProductCommand, RollbackProductCommand } from './commands/impl/product.commands';

@Controller()
export class ProductBaseController {
  constructor(
    private readonly productBaseService: ProductBaseService,
    private readonly commandBus: CommandBus,
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka
  ) { }

  @MessagePattern(TOPIC_CREATE_PRODUCT_COMMAND)
  async handleCreateProduct(@Payload() message: any) {
    console.log('Product Base: Received Create Command', message);

    try {
      const command = new CreateProductCommand(
        message.transactionId,
        message.name,
        message.price,
        message.description,
      );

      const product = await this.commandBus.execute(command);
      console.log('Product Base: Product created successfully', product.id);
    } catch (error) {
      console.error('Product Base: Failed to create product', error);
      // TODO: Emit failure event
    }
  }

  @MessagePattern(TOPIC_ROLLBACK_PRODUCT_COMMAND)
  async handleRollbackProduct(@Payload() message: any) {
    console.log('Product Base: Received Rollback Command', message);

    try {
      const command = new RollbackProductCommand(
        message.transactionId,
        message.productId,
      );

      await this.commandBus.execute(command);
      console.log('Product Base: Product rolled back successfully');
    } catch (error) {
      console.error('Product Base: Failed to rollback product', error);
    }
  }
}
