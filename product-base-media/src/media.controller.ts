import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { CreateMediaCommand, RollbackMediaCommand } from './commands/impl/media.commands';

@Controller()
export class MediaController {
  constructor(private readonly commandBus: CommandBus) { }

  @MessagePattern('media.upload')
  async handleUploadMedia(@Payload() message: any) {
    console.log('Media: Received Upload Command', message);

    try {
      const command = new CreateMediaCommand(
        message.transactionId,
        message.productId,
        message.bucket || 'products',
        message.key,
        message.url,
        message.type,
      );

      const media = await this.commandBus.execute(command);
      console.log('Media: Uploaded successfully', media.id);
    } catch (error) {
      console.error('Media: Failed to upload', error);
    }
  }

  @MessagePattern('media.rollback')
  async handleRollbackMedia(@Payload() message: any) {
    console.log('Media: Received Rollback Command', message);

    try {
      const command = new RollbackMediaCommand(
        message.transactionId,
        message.mediaId,
      );

      await this.commandBus.execute(command);
      console.log('Media: Rolled back successfully');
    } catch (error) {
      console.error('Media: Failed to rollback', error);
    }
  }
}
