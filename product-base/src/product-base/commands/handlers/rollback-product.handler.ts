import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RollbackProductCommand } from '../impl/product.commands';
import { ProductBaseEntity } from '../../entities/product-base.entity';

@CommandHandler(RollbackProductCommand)
export class RollbackProductHandler implements ICommandHandler<RollbackProductCommand> {
  constructor(
    @InjectRepository(ProductBaseEntity)
    private readonly productRepository: Repository<ProductBaseEntity>,
  ) { }

  async execute(command: RollbackProductCommand): Promise<void> {
    await this.productRepository.update(
      { id: command.productId },
      { status: 'DELETED' },
    );
  }
}
