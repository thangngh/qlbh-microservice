import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AttributeController } from './attribute.controller';
import { ProductBaseAttributeEntity } from './entities/product-base-attribute.entity';

// Command Handlers
import { CreateAttributeHandler } from './commands/handlers/create-attribute.handler';

// Event Handlers
import { AttributeCreatedHandler } from './events/handlers/attribute-created.handler';

const CommandHandlers = [CreateAttributeHandler];
const EventHandlers = [AttributeCreatedHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductBaseAttributeEntity]),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'product-base-attribute-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AttributeController],
  providers: [...CommandHandlers, ...EventHandlers],
})
export class AttributeModule { }
