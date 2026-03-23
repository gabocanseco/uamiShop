import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { AppModule } from '../../src/app.module';

vi.mock('@golevelup/nestjs-rabbitmq', () => ({
  AmqpConnection: class {
    publish = vi.fn().mockResolvedValue(true);
    channel = { close: vi.fn() };
    connect = vi.fn();
    setupChannel = vi.fn();
  },
  RabbitMQModule: {
    forRoot: () => ({ module: class {}, exports: [] }),
  },
}));

describe('carrito (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('DataSource')
      .useValue(undefined)
      .overrideProvider('CatalogoApi')
      .useValue({
        obtenerProducto: vi.fn().mockResolvedValue({
          id: 'fec96173-7df5-4a45-a162-5d1cca312467',
          nombre: 'Laptop',
          precio: 1000,
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('/carritos (POST)', async () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const response = await request(app.getHttpServer())
      .post(`/carritos/${validUuid}`)
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        clienteId: validUuid,
      }),
    );
  });
});
