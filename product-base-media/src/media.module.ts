import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MediaController } from './media.controller';
import { ProductBaseMediaEntity } from './entities/product-base-media.entity';

// Command Handlers
import { CreateMediaHandler } from './commands/handlers/create-media.handler';
import { RollbackMediaHandler } from './commands/handlers/rollback-media.handler';

// Event Handlers
import { MediaCreatedHandler } from './events/handlers/media-created.handler';

const CommandHandlers = [CreateMediaHandler, RollbackMediaHandler];
const EventHandlers = [MediaCreatedHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductBaseMediaEntity]),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'product-base-media-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [MediaController],
  providers: [...CommandHandlers, ...EventHandlers],
})
export class MediaModule { }
