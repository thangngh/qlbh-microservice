import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCommand } from '../impl/product.commands';
import { ProductBaseEntity } from '../../entities/product-base.entity';
import { ProductCreatedEvent } from '../../events/impl/product.events';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(
    @InjectRepository(ProductBaseEntity)
    private readonly productRepository: Repository<ProductBaseEntity>,
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: CreateProductCommand): Promise<ProductBaseEntity> {
    const product = this.productRepository.create({
      name: command.name,
      price: command.price,
      description: command.description,
      status: 'ACTIVE',
    });

    const savedProduct = await this.productRepository.save(product);

    // Publish event
    this.eventBus.publish(
      new ProductCreatedEvent(
        command.transactionId,
        savedProduct.id,
        savedProduct.name,
        savedProduct.price,
      ),
    );

    return savedProduct;
  }
}
