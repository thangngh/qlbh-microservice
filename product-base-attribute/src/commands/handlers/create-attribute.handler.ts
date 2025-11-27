import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeCommand } from '../impl/attribute.commands';
import { ProductBaseAttributeEntity } from '../../entities/product-base-attribute.entity';
import { AttributeCreatedEvent } from '../../events/impl/attribute.events';

@CommandHandler(CreateAttributeCommand)
export class CreateAttributeHandler implements ICommandHandler<CreateAttributeCommand> {
  constructor(
    @InjectRepository(ProductBaseAttributeEntity)
    private readonly attributeRepository: Repository<ProductBaseAttributeEntity>,
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: CreateAttributeCommand): Promise<ProductBaseAttributeEntity> {
    const attribute = this.attributeRepository.create({
      productId: command.productId,
      key: command.key,
      value: command.value,
      status: 'ACTIVE',
    });

    const savedAttribute = await this.attributeRepository.save(attribute);

    this.eventBus.publish(
      new AttributeCreatedEvent(
        command.transactionId,
        savedAttribute.id,
        savedAttribute.productId,
      ),
    );

    return savedAttribute;
  }
}
