import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserHandler } from './handlers/create-user.handler';
import { GetUserByEmailHandler } from './handlers/get-user-by-email.handler';
import { UsersController } from './users.controller';

const CommandHandlers = [CreateUserHandler];
const QueryHandlers = [GetUserByEmailHandler];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
  ],
  controllers: [UsersController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class UsersModule { }
