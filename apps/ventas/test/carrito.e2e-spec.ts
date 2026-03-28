// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import request from 'supertest';
// import { App } from 'supertest/types';
// import { AppModule } from '../../src/app.module';
// import { describe, it, expect, beforeEach, afterAll } from 'vitest';

// describe('carrito (e2e)', () => {
//   let app: INestApplication<App>;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });
//   //Creamos un carrito antes de cada test
//   it('/carritos (POST)', async () => {
//     const validUuid = '550e8400-e29b-41d4-a716-446655440000';
//     const response = await request(app.getHttpServer())
//       .post(`/carritos/${validUuid}`)
//       .expect(201);

//     expect(response.body).toEqual(
//       expect.objectContaining({
//         clienteId: validUuid,
//       }),
//     );
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
