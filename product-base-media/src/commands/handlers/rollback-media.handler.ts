import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RollbackMediaCommand } from '../impl/media.commands';
import { ProductBaseMediaEntity } from '../../entities/product-base-media.entity';

@CommandHandler(RollbackMediaCommand)
export class RollbackMediaHandler implements ICommandHandler<RollbackMediaCommand> {
  constructor(
    @InjectRepository(ProductBaseMediaEntity)
    private readonly mediaRepository: Repository<ProductBaseMediaEntity>,
  ) { }

  async execute(command: RollbackMediaCommand): Promise<void> {
    await this.mediaRepository.update(
      { id: command.mediaId },
      { status: 'DELETED' },
    );
  }
}
