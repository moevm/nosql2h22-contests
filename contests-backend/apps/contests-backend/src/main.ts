import { NestFactory } from '@nestjs/core';
import { ContestsBackendModule } from './contests-backend.module';

async function bootstrap() {
  const app = await NestFactory.create(ContestsBackendModule);
  await app.listen(3000);
}
bootstrap();
