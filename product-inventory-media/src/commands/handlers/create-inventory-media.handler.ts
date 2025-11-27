import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryMediaCommand } from '../impl/inventory-media.commands';
import { ProductInventoryMediaEntity } from '../../entities/product-inventory-media.entity';
import { InventoryMediaCreatedEvent } from '../../events/impl/inventory-media.events';

@CommandHandler(CreateInventoryMediaCommand)
export class CreateInventoryMediaHandler implements ICommandHandler<CreateInventoryMediaCommand> {
  constructor(
    @InjectRepository(ProductInventoryMediaEntity)
    private readonly mediaRepository: Repository<ProductInventoryMediaEntity>,
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: CreateInventoryMediaCommand): Promise<ProductInventoryMediaEntity> {
    const media = this.mediaRepository.create({
      inventoryId: command.inventoryId,
      bucket: command.bucket,
      key: command.key,
      url: command.url,
      type: command.type,
      status: 'ACTIVE',
    });

    const savedMedia = await this.mediaRepository.save(media);

    this.eventBus.publish(
      new InventoryMediaCreatedEvent(
        command.transactionId,
        savedMedia.id,
        savedMedia.inventoryId,
      ),
    );

    return savedMedia;
  }
}
