import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InventoryCreatedEvent } from '../impl/inventory.events';

@EventsHandler(InventoryCreatedEvent)
export class InventoryCreatedHandler implements IEventHandler<InventoryCreatedEvent> {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) { }

  handle(event: InventoryCreatedEvent) {
    console.log('Inventory: Publishing InventoryCreatedEvent to Kafka', event);

    this.kafkaClient.emit('inventory.created', {
      transactionId: event.transactionId,
      inventoryId: event.inventoryId,
      productId: event.productId,
      sku: event.sku,
      quantity: event.quantity,
    });
  }
}
