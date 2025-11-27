import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ProductCreatedEvent } from '../impl/product.events';
import { KAFKA_CLIENT, TOPIC_PRODUCT_CREATED_EVENT } from '../../../constants';

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedHandler implements IEventHandler<ProductCreatedEvent> {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
  ) { }

  handle(event: ProductCreatedEvent) {
    console.log('Product Base: Publishing ProductCreatedEvent to Kafka', event);

    this.kafkaClient.emit(TOPIC_PRODUCT_CREATED_EVENT, {
      transactionId: event.transactionId,
      productId: event.productId,
      name: event.name,
      price: event.price,
    });
  }
}
