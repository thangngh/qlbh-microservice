import { Injectable, Inject } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable, of, from } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SagaInstance, SagaStatus } from './saga-instance.entity';
import { ProductCreatedEvent, CreateInventoryCommand, InventoryCreatedEvent, UploadMediaCommand, MediaUploadedEvent } from './saga.dto';
import { KAFKA_CLIENT, TOPIC_CREATE_INVENTORY_COMMAND, TOPIC_UPLOAD_MEDIA_COMMAND, TOPIC_CREATE_PRODUCT_COMMAND } from '../constants';
import { CreateProductAggregateDto } from '../dto/create-product-aggregate.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrchestratorSaga {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    @InjectRepository(SagaInstance) private readonly sagaRepository: Repository<SagaInstance>,
  ) { }

  async startSaga(payload: CreateProductAggregateDto): Promise<string> {
    const transactionId = uuidv4();
    const saga = this.sagaRepository.create({
      id: transactionId,
      payload,
      status: SagaStatus.STARTED,
      stepStatus: {
        base: 'PENDING',
        inventory: 'PENDING',
        media: 'PENDING',
      },
    });
    await this.sagaRepository.save(saga);

    // Trigger Step 1: Create Product Base
    const command = { transactionId, ...payload.productBase };
    this.kafkaClient.emit(TOPIC_CREATE_PRODUCT_COMMAND, command);

    return transactionId;
  }

  @Saga()
  productCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(ProductCreatedEvent),
      mergeMap(async (event) => {
        console.log('Saga: Product Created', event);

        // Update State
        const saga = await this.sagaRepository.findOne({ where: { id: event.transactionId } });
        if (!saga) return null;

        saga.stepStatus.base = 'COMPLETED';
        saga.payload.productId = event.productId; // Store ID for next steps
        await this.sagaRepository.save(saga);

        // Trigger Parallel Steps
        // 1. Inventory
        if (saga.payload.inventory && saga.payload.inventory.length > 0) {
          // For simplicity, taking first item. In real world, loop or aggregate.
          const invItem = saga.payload.inventory[0];
          const invCommand = new CreateInventoryCommand(event.transactionId, event.productId, invItem.quantity);
          this.kafkaClient.emit(TOPIC_CREATE_INVENTORY_COMMAND, invCommand);
        } else {
          saga.stepStatus.inventory = 'SKIPPED';
        }

        // 2. Media
        if (saga.payload.media && saga.payload.media.length > 0) {
          const mediaUrls = saga.payload.media.map(m => m.url);
          const mediaCommand = new UploadMediaCommand(event.transactionId, event.productId, mediaUrls);
          this.kafkaClient.emit(TOPIC_UPLOAD_MEDIA_COMMAND, mediaCommand);
        } else {
          saga.stepStatus.media = 'SKIPPED';
        }

        await this.sagaRepository.save(saga);
        return null;
      }),
      map(() => null as unknown as ICommand),
    );
  }

  @Saga()
  inventoryCreated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(InventoryCreatedEvent),
      mergeMap(async (event) => {
        console.log('Saga: Inventory Created', event);
        const saga = await this.sagaRepository.findOne({ where: { id: event.transactionId } });
        if (saga) {
          saga.stepStatus.inventory = 'COMPLETED';
          await this.sagaRepository.save(saga);
          await this.checkCompletion(saga);
        }
        return null;
      }),
      map(() => null as unknown as ICommand),
    );
  }

  @Saga()
  mediaUploaded = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(MediaUploadedEvent),
      mergeMap(async (event) => {
        console.log('Saga: Media Uploaded', event);
        const saga = await this.sagaRepository.findOne({ where: { id: event.transactionId } });
        if (saga) {
          saga.stepStatus.media = 'COMPLETED';
          await this.sagaRepository.save(saga);
          await this.checkCompletion(saga);
        }
        return null;
      }),
      map(() => null as unknown as ICommand),
    );
  }

  private async checkCompletion(saga: SagaInstance) {
    const steps = ['base', 'inventory', 'media'];
    const allDone = steps.every(step =>
      saga.stepStatus[step] === 'COMPLETED' || saga.stepStatus[step] === 'SKIPPED'
    );

    if (allDone) {
      saga.status = SagaStatus.COMPLETED;
      await this.sagaRepository.save(saga);
      console.log(`Saga ${saga.id} COMPLETED successfully.`);
    }
  }
}

