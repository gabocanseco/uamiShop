import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@shared/controller/filters/global-expcetion.filter';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    // Compara y transforma json a dtos/clases de dominio
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      transform: true, // Transforma los payloads a los tipos definidos en los DTOs (ej. string a number)
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter()); // Manejo de errores http

  app.enableVersioning({
    type: VersioningType.URI, // Puede ser URI, HEADER, MEDIA_TYPE o CUSTOM
    prefix: 'v', // Prefijo para la versión en la URI (ej. http//localhost:3000/v1/endpoint)
    defaultVersion: '1', // Versión por defecto si no se especifica
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
