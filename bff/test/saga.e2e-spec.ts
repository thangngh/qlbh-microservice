import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { KAFKA_CLIENT, TOPIC_CREATE_PRODUCT_COMMAND } from './../src/constants';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SagaInstance } from './../src/saga/saga-instance.entity';

describe('Saga Flow (e2e)', () => {
  let app: INestApplication;
  let kafkaClientMock: any;
  let sagaRepositoryMock: any;

  beforeEach(async () => {
    kafkaClientMock = {
      emit: jest.fn(),
      connect: jest.fn(),
      close: jest.fn(),
    };

    sagaRepositoryMock = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: 'test-uuid', ...entity })),
      findOne: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(KAFKA_CLIENT)
      .useValue(kafkaClientMock)
      .overrideProvider(getRepositoryToken(SagaInstance))
      .useValue(sagaRepositoryMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/product (POST) - Happy Path', async () => {
    const bigBody = {
      productBase: {
        name: 'Test Product',
        price: 100,
        description: 'Test Description',
      },
      attributes: [],
      media: [],
      inventory: [],
    };

    const response = await request(app.getHttpServer())
      .post('/product')
      .send(bigBody)
      .expect(201);

    expect(response.body).toHaveProperty('transactionId');
    expect(response.body.status).toBe('STARTED');

    // Verify Kafka Event was emitted
    expect(kafkaClientMock.emit).toHaveBeenCalledWith(
      TOPIC_CREATE_PRODUCT_COMMAND,
      expect.objectContaining({
        transactionId: expect.any(String),
        name: 'Test Product',
      }),
    );

    // Verify Saga State was saved
    expect(sagaRepositoryMock.save).toHaveBeenCalled();
  });
});
