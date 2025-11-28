import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true, // Allow all origins for dev, restrict in prod
    credentials: true,
  });
  await app.listen(3002); // Run on port 3002
}
bootstrap();
