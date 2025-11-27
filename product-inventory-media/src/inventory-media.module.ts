import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryMediaController } from './inventory-media.controller';
import { ProductInventoryMediaEntity } from './entities/product-inventory-media.entity';

// Command Handlers
import { CreateInventoryMediaHandler } from './commands/handlers/create-inventory-media.handler';

// Event Handlers
import { InventoryMediaCreatedHandler } from './events/handlers/inventory-media-created.handler';

const CommandHandlers = [CreateInventoryMediaHandler];
const EventHandlers = [InventoryMediaCreatedHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductInventoryMediaEntity]),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'product-inventory-media-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [InventoryMediaController],
  providers: [...CommandHandlers, ...EventHandlers],
})
export class InventoryMediaModule { }
