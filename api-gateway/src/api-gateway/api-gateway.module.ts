import { Module } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ApiGatewayController } from './api-gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (/**configService: ConfigService*/) => ({
          transport: Transport.GRPC,
          options: {
            package: 'bff',
            protoPath: join(process.cwd(), 'dist/proto/bff.proto'),
            url: 'localhost:50052',
          },
        }),
        name: 'BFF_SERVICE',
      },
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
