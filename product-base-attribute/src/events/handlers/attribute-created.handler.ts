import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AttributeCreatedEvent } from '../impl/attribute.events';

@EventsHandler(AttributeCreatedEvent)
export class AttributeCreatedHandler implements IEventHandler<AttributeCreatedEvent> {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) { }

  handle(event: AttributeCreatedEvent) {
    console.log('Attribute: Publishing AttributeCreatedEvent to Kafka', event);

    this.kafkaClient.emit('attribute.created', {
      transactionId: event.transactionId,
      attributeId: event.attributeId,
      productId: event.productId,
    });
  }
}
