import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserByEmailQuery } from '../queries/get-user-by-email.query';
import { UserEntity } from '../entities/user.entity';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async execute(query: GetUserByEmailQuery): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email: query.email } });
  }
}
