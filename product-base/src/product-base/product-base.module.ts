import { Module } from '@nestjs/common';
import { ProductBaseService } from './product-base.service';
import { ProductBaseController } from './product-base.controller';
import { ProductQueryController } from './product-query.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBaseEntity } from './entities/product-base.entity';
import { ProductAggregateView } from './views/product-aggregate.view';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Command Handlers
import { CreateProductHandler } from './commands/handlers/create-product.handler';
import { RollbackProductHandler } from './commands/handlers/rollback-product.handler';

// Event Handlers
import { ProductCreatedHandler } from './events/handlers/product-created.handler';

// Query Handlers
import { GetProductHandler } from './queries/handlers/get-product.handler';
import { GetProductAggregateHandler } from './queries/handlers/get-product-aggregate.handler';
import { GetAllProductAggregatesHandler } from './queries/handlers/get-all-product-aggregates.handler';

const CommandHandlers = [CreateProductHandler, RollbackProductHandler];
const EventHandlers = [ProductCreatedHandler];
const QueryHandlers = [GetProductHandler, GetProductAggregateHandler, GetAllProductAggregatesHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductBaseEntity, ProductAggregateView]),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'product-base-client-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [ProductBaseController, ProductQueryController],
  providers: [
    ProductBaseService,
    ...CommandHandlers,
    ...EventHandlers,
    ...QueryHandlers,
  ],
})
export class ProductBaseModule { }
