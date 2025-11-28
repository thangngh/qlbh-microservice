import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialEntity } from './entities/credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CredentialEntity])],
  exports: [TypeOrmModule],
})
export class UsersModule { }
