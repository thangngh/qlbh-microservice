import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateInventoryCommand, RollbackInventoryCommand } from './commands/impl/inventory.commands';

@Controller()
export class InventoryController {
  constructor(private readonly commandBus: CommandBus) { }

  @MessagePattern('inventory.create')
  async handleCreateInventory(@Payload() message: any) {
    console.log('Inventory: Received Create Command', message);

    try {
      const command = new CreateInventoryCommand(
        message.transactionId,
        message.productId,
        message.sku || `SKU-${Date.now()}`,
        message.quantity || 0,
      );

      const inventory = await this.commandBus.execute(command);
      console.log('Inventory: Created successfully', inventory.id);
    } catch (error) {
      console.error('Inventory: Failed to create', error);
    }
  }

  @MessagePattern('inventory.rollback')
  async handleRollbackInventory(@Payload() message: any) {
    console.log('Inventory: Received Rollback Command', message);

    try {
      const command = new RollbackInventoryCommand(
        message.transactionId,
        message.inventoryId,
      );

      await this.commandBus.execute(command);
      console.log('Inventory: Rolled back successfully');
    } catch (error) {
      console.error('Inventory: Failed to rollback', error);
    }
  }
}
