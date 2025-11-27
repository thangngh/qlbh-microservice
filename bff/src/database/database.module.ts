import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './database.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SagaInstance } from '../saga/saga-instance.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: DatabaseConfigService,
    }),
    TypeOrmModule.forFeature([SagaInstance]),
  ],
  controllers: [],
  exports: [TypeOrmModule],
  providers: [DatabaseConfigService],
})
export class DatabaseModule { }
