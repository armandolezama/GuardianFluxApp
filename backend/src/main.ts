import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // más adelante puedes poner prefijo global: app.setGlobalPrefix('api/v1');

  await app.listen(3000);
  console.log('GuardianFlux backend listening on http://localhost:3000');
}

bootstrap();
