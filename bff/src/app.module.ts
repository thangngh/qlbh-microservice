import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrchestratorSaga } from './saga/orchestrator.saga';

import { ClientsModule, Transport } from '@nestjs/microservices';

import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'bff-client-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, OrchestratorSaga],
})
export class AppModule { }
