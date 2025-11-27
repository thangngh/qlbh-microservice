import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MediaCreatedEvent } from '../impl/media.events';

@EventsHandler(MediaCreatedEvent)
export class MediaCreatedHandler implements IEventHandler<MediaCreatedEvent> {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) { }

  handle(event: MediaCreatedEvent) {
    console.log('Media: Publishing MediaCreatedEvent to Kafka', event);

    this.kafkaClient.emit('media.created', {
      transactionId: event.transactionId,
      mediaId: event.mediaId,
      productId: event.productId,
    });
  }
}
