import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RollbackInventoryCommand } from '../impl/inventory.commands';
import { ProductInventoryEntity } from '../../entities/product-inventory.entity';

@CommandHandler(RollbackInventoryCommand)
export class RollbackInventoryHandler implements ICommandHandler<RollbackInventoryCommand> {
  constructor(
    @InjectRepository(ProductInventoryEntity)
    private readonly inventoryRepository: Repository<ProductInventoryEntity>,
  ) { }

  async execute(command: RollbackInventoryCommand): Promise<void> {
    await this.inventoryRepository.update(
      { id: command.inventoryId },
      { status: 'DELETED' },
    );
  }
}
