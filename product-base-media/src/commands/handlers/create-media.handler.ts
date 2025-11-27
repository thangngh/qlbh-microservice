import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaCommand } from '../impl/media.commands';
import { ProductBaseMediaEntity } from '../../entities/product-base-media.entity';
import { MediaCreatedEvent } from '../../events/impl/media.events';

@CommandHandler(CreateMediaCommand)
export class CreateMediaHandler implements ICommandHandler<CreateMediaCommand> {
  constructor(
    @InjectRepository(ProductBaseMediaEntity)
    private readonly mediaRepository: Repository<ProductBaseMediaEntity>,
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: CreateMediaCommand): Promise<ProductBaseMediaEntity> {
    const media = this.mediaRepository.create({
      productId: command.productId,
      bucket: command.bucket,
      key: command.key,
      url: command.url,
      type: command.type,
      status: 'ACTIVE',
    });

    const savedMedia = await this.mediaRepository.save(media);

    this.eventBus.publish(
      new MediaCreatedEvent(
        command.transactionId,
        savedMedia.id,
        savedMedia.productId,
      ),
    );

    return savedMedia;
  }
}
