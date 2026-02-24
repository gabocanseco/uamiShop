import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';

describe('Catalogo (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Creamos un producto antes de cada test para que la base de datos no esté vacía
    const res = await request(app.getHttpServer()).post('/productos').send({
      nombre: 'Producto Base',
      descripcion: 'Descripcion Producto Base',
      precio: 10,
      categoriaId: '0213701e-4b44-4d00-9ecc-07014ea4f1e1',
    });
  });

  it('/productos (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/productos')
      .expect(200);

    // Verifica que devuelva un arreglo
    expect(Array.isArray(response.body)).toBe(true);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nombre: 'Producto Base',
          descripcion: 'Descripcion Producto Base',
          precio: 10,
          categoriaId: '0213701e-4b44-4d00-9ecc-07014ea4f1e1',
        }),
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
  });
});
