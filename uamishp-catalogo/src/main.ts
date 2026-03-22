import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '@shared/controller/filters/global-exception.filter';
import { VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Configuración global de validación
   */
  app.useGlobalPipes(
    // Compara y transforma json a dtos/clases de dominio
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      transform: true, // Transforma los payloads a los tipos definidos en los DTOs (ej. string a number)
      exceptionFactory: (errors) => {
        console.log(
          'ERRORES DE VALIDACIÓN DETALLADOS:',
          JSON.stringify(errors, null, 2),
        );
        return new BadRequestException(errors);
      },
    }),
  );

  /**
   * Manejo global de excepciones
   */
  app.useGlobalFilters(new GlobalExceptionFilter()); // Manejo de errores http

  /**
   * Configuración de versionado
   */
  app.enableVersioning({
    type: VersioningType.URI, // Puede ser URI, HEADER, MEDIA_TYPE o CUSTOM
    prefix: 'v', // Prefijo para la versión en la URI (ej. http//localhost:3000/v1/endpoint)
    defaultVersion: '1', // Versión por defecto si no se especifica
  });

  /**
   * Configuración de Swagger para documentación de la API
   */
  const config = new DocumentBuilder()
    .setTitle('uamiShop API')
    .setDescription('API de tienda en línea')
    .setVersion('1.0')
    .addTag('Productos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // URL: http://localhost:3001/api/docs

  await app.listen(process.env.PORT ?? 3001);
  //console.log(`Swagger disponible en http://localhost:${process.env.PORT ?? 3001}/api/docs`);
}
bootstrap();
