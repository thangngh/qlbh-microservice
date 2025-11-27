import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAttributeCommand } from './commands/impl/attribute.commands';

@Controller()
export class AttributeController {
  constructor(private readonly commandBus: CommandBus) { }

  @MessagePattern('attribute.create')
  async handleCreateAttribute(@Payload() message: any) {
    console.log('Attribute: Received Create Command', message);

    try {
      // Handle batch creation if attributes is an array
      if (Array.isArray(message.attributes)) {
        for (const attr of message.attributes) {
          const command = new CreateAttributeCommand(
            message.transactionId,
            message.productId,
            attr.key,
            attr.value,
          );
          await this.commandBus.execute(command);
        }
      } else {
        const command = new CreateAttributeCommand(
          message.transactionId,
          message.productId,
          message.key,
          message.value,
        );
        await this.commandBus.execute(command);
      }

      console.log('Attribute: Created successfully');
    } catch (error) {
      console.error('Attribute: Failed to create', error);
    }
  }
}
