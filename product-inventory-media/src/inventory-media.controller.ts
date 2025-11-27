import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateInventoryMediaCommand } from './commands/impl/inventory-media.commands';

@Controller()
export class InventoryMediaController {
  constructor(private readonly commandBus: CommandBus) { }

  @MessagePattern('inventory.media.upload')
  async handleUploadMedia(@Payload() message: any) {
    console.log('Inventory Media: Received Upload Command', message);

    try {
      const command = new CreateInventoryMediaCommand(
        message.transactionId,
        message.inventoryId,
        message.bucket || 'inventory',
        message.key,
        message.url,
        message.type,
      );

      const media = await this.commandBus.execute(command);
      console.log('Inventory Media: Uploaded successfully', media.id);
    } catch (error) {
      console.error('Inventory Media: Failed to upload', error);
    }
  }
}
