import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InventoryMediaCreatedEvent } from '../impl/inventory-media.events';

@EventsHandler(InventoryMediaCreatedEvent)
export class InventoryMediaCreatedHandler implements IEventHandler<InventoryMediaCreatedEvent> {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) { }

  handle(event: InventoryMediaCreatedEvent) {
    console.log('Inventory Media: Publishing InventoryMediaCreatedEvent to Kafka', event);

    this.kafkaClient.emit('inventory.media.created', {
      transactionId: event.transactionId,
      mediaId: event.mediaId,
      inventoryId: event.inventoryId,
    });
  }
}
