import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://warmly-intro-assistant.vercel.app',
    ],
  });                                     
                                                                       
  const connection = app.get<Connection>(getConnectionToken());

  if (connection.readyState === 1) {
    Logger.log('🚀 MongoDB already connected', 'Database');
  }

  connection.on('connected', () => {
    Logger.log('😀 MongoDB connected', 'Database');
  });

  connection.on('error', (err) => {
    Logger.error(`😔 MongoDB connection error: ${err}`, 'Database');
  });

  connection.on('disconnected', () => {
    Logger.warn('⚠️ MongoDB disconnected', 'Database');
  });

  await app.listen(process.env.PORT ?? 4000, '0.0.0.0');
}

bootstrap().catch(error => {
  Logger.error('Application failed to start', error);
  process.exit(1);
});                       
