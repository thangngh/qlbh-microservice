import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserCommand } from '../commands/create-user.command';
import { UserEntity } from '../entities/user.entity';
import { UserCreatedEvent } from '../events/user-created.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly eventBus: EventBus,
  ) { }

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const { email, name, avatar } = command;

    // Check if user exists (idempotency)
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      return existingUser;
    }

    const user = this.userRepository.create({ email, name, avatar });
    const savedUser = await this.userRepository.save(user);

    // Publish event
    this.eventBus.publish(new UserCreatedEvent(savedUser.id, savedUser.email));

    return savedUser;
  }
}
