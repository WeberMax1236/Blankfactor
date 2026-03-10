import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLogger } from './logger/winston.logger';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
  });

  // API prefix
  app.setGlobalPrefix('api');

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * Swagger configuration
   */
  const config = new DocumentBuilder()
    .setTitle('BKX Bets API')
    .setDescription('Casino Backend API documentation')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Wallet')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger URL
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();