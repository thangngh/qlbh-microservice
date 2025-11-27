import { Module } from '@nestjs/common';
import { DatabaseConfigService } from './database.config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useClass: DatabaseConfigService,
    }),
  ],
  controllers: [],
  exports: [TypeOrmModule],
  providers: [DatabaseConfigService],
})
export class DatabaseModule { }
