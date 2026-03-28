import { BadRequestException, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { GlobalExceptionFilter } from '@app/shared';
import { CatalogoIntegrationTestModule } from './catalogo-integration.module';
import { ProductoOrmEntity } from '@catalogo/infrastructure/persistence/entities/producto-orm.entity';
import { CategoriaOrmEntity } from '@catalogo/infrastructure/persistence/entities/categoria-orm.entity';

describe('Integración HTTP — persistencia crítica de producto y categoría', () => {
  let app: INestApplication;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    process.env.NODE_ENV = 'catalogo-integration';
    initializeTransactionalContext();

    moduleRef = await Test.createTestingModule({
      imports: [CatalogoIntegrationTestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: (errors) => new BadRequestException(errors),
      }),
    );
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
      defaultVersion: '1',
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /v1/categorias + POST /v1/productos persiste y GET devuelve el recurso', async () => {
    const catRes = await request(app.getHttpServer())
      .post('/v1/categorias')
      .send({ nombre: 'Integración HTTP', descripcion: 'Cat para prueba' })
      .expect(201);

    expect(catRes.body.id).toBeDefined();
    const categoriaId = catRes.body.id;

    const prodRes = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Producto integración',
        descripcion: 'Descripción válida del producto de prueba',
        precio: 49.99,
        categoriaId,
      })
      .expect(201);

    expect(prodRes.body.id).toBeDefined();
    expect(prodRes.body.categoriaId).toBe(categoriaId);

    const getRes = await request(app.getHttpServer())
      .get(`/v1/productos/${prodRes.body.id}`)
      .expect(200);

    expect(getRes.body.nombre).toBe('Producto integración');

    const ds = moduleRef.get<DataSource>(getDataSourceToken());
    const row = await ds.manager.findOne(ProductoOrmEntity, {
      where: { id: prodRes.body.id },
    });
    expect(row).toBeTruthy();
    expect(row!.categoriaId).toBe(categoriaId);
  });

  it('POST /v1/productos con categoría inexistente responde 404 (regla de negocio crítica)', async () => {
    const fakeCat = '00000000-0000-4000-8000-000000000099';

    await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Sin categoría válida',
        descripcion: 'Descripción suficiente para validación',
        precio: 10,
        categoriaId: fakeCat,
      })
      .expect(404);
  });

  it('validación rechaza payload de producto inválido (precio no positivo)', async () => {
    const catRes = await request(app.getHttpServer())
      .post('/v1/categorias')
      .send({ nombre: 'Val Cat', descripcion: 'Para validación' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Ok nombre',
        descripcion: 'Ok desc',
        precio: 0,
        categoriaId: catRes.body.id,
      })
      .expect(400);
  });

  it('integridad: producto referencia categoría almacenada en la misma BD', async () => {
    const ds = moduleRef.get<DataSource>(getDataSourceToken());
    const catRes = await request(app.getHttpServer())
      .post('/v1/categorias')
      .send({ nombre: 'Ref integ', descripcion: 'Ref' })
      .expect(201);

    const categoriaRow = [...(await ds.manager.find(CategoriaOrmEntity))].find(
      (c) => c.id === catRes.body.id,
    );
    expect(categoriaRow).toBeTruthy();

    const prodRes = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Con ref categoría',
        descripcion: 'Descripción de producto con referencia',
        precio: 5,
        categoriaId: catRes.body.id,
      })
      .expect(201);

    const productoRow = await ds.manager.findOne(ProductoOrmEntity, {
      where: { id: prodRes.body.id },
    });

    expect(productoRow!.categoriaId).toBe(categoriaRow!.id);
  });
});
