import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from './inventory.controller';
import { ProductInventoryEntity } from './entities/product-inventory.entity';

// Command Handlers
import { CreateInventoryHandler } from './commands/handlers/create-inventory.handler';
import { RollbackInventoryHandler } from './commands/handlers/rollback-inventory.handler';

// Event Handlers
import { InventoryCreatedHandler } from './events/handlers/inventory-created.handler';

const CommandHandlers = [CreateInventoryHandler, RollbackInventoryHandler];
const EventHandlers = [InventoryCreatedHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductInventoryEntity]),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'product-inventory-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [InventoryController],
  providers: [...CommandHandlers, ...EventHandlers],
})
export class InventoryModule { }
