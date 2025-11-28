import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/create-user.command';
import { GetUserByEmailQuery } from './queries/get-user-by-email.query';

@Controller()
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @MessagePattern('user.create')
  async create(@Payload() data: { email: string; name: string; avatar?: string }) {
    return await this.commandBus.execute(
      new CreateUserCommand(data.email, data.name, data.avatar),
    );
  }

  @MessagePattern('user.find_by_email')
  async findByEmail(@Payload() email: string) {
    return await this.queryBus.execute(
      new GetUserByEmailQuery(email),
    );
  }
}
