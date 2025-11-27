import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryCommand } from '../impl/inventory.commands';
import { ProductInventoryEntity } from '../../entities/product-inventory.entity';
import { InventoryCreatedEvent } from '../../events/impl/inventory.events';

@CommandHandler(CreateInventoryCommand)
export class CreateInventoryHandler implements ICommandHandler<CreateInventoryCommand> {
  constructor(
    @InjectRepository(ProductInventoryEntity)
    private readonly inventoryRepository: Repository<ProductInventoryEntity>,
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: CreateInventoryCommand): Promise<ProductInventoryEntity> {
    const inventory = this.inventoryRepository.create({
      productId: command.productId,
      sku: command.sku,
      quantity: command.quantity,
      status: 'ACTIVE',
    });

    const savedInventory = await this.inventoryRepository.save(inventory);

    this.eventBus.publish(
      new InventoryCreatedEvent(
        command.transactionId,
        savedInventory.id,
        savedInventory.productId,
        savedInventory.sku,
        savedInventory.quantity,
      ),
    );

    return savedInventory;
  }
}
