import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { describe, it, expect, beforeEach, afterAll } from 'vitest';

describe('Catalogo (e2e)', () => {
  let app: INestApplication<App>;
  let productoId: string;
  let categoriaId: string;

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
  });  it('POST /categorias - deberia crear una categoria', async () => {
    const response = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        nombre: 'Electronica',
        descripcion: 'Categoria de dispositivos',
      })
      .expect(201);

    // Guardamos el ID para usarlo después
    categoriaId = response.body.id;

    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe('Electronica');
  });

  it('GET /categorias - deberia obtener todas las categorias', async () => {
    const response = await request(app.getHttpServer())
      .get('/categorias')
      .expect(200);

    // Verifica que devuelva un arreglo
    expect(Array.isArray(response.body)).toBe(true);
  });

  // ==========================
  // PRODUCTOS
  // ==========================

  it('POST /productos - deberia crear un producto', async () => {
    // Primero creamos categoría necesaria
    const categoriaRes = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        nombre: 'Ropa',
        descripcion: 'Categoria de ropa',
      });

    const response = await request(app.getHttpServer())
      .post('/productos')
      .send({
        nombre: 'Camisa',
        descripcion: 'Camisa blanca',
        precio: 200,
        categoria: 'Ropa',
      })
      .expect(201);

    productoId = response.body.id;

    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe('Camisa');
    expect(response.body.precio).toBe(200);
  });

  it('GET /productos - deberia obtener todos los productos', async () => {
    const response = await request(app.getHttpServer())
      .get('/productos')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /productos/:id - deberia obtener un producto por id', async () => {
    // Crear categoría
    const categoriaRes = await request(app.getHttpServer())
      .post('/categorias')
      .send({
        nombre: 'Libros',
        descripcion: 'Categoria libros',
      });

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/productos')
      .send({
        nombre: 'Libro JS',
        descripcion: 'Aprende JS',
        precio: 150,
        categoria: 'Libros',
      });

    const id = productoRes.body.id;

    const response = await request(app.getHttpServer())
      .get(`/productos/${id}`)
      .expect(200);

    expect(response.body.id).toBe(id);
    expect(response.body.nombre).toBe('Libro JS');
  });

  it('PUT /productos/:id - deberia actualizar un producto', async () => {
    // Crear categoría
    await request(app.getHttpServer())
      .post('/categorias')
      .send({
        nombre: 'Deportes',
        descripcion: 'Categoria deportes',
      });

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/productos')
      .send({
        nombre: 'Balon',
        descripcion: 'Balon futbol',
        precio: 300,
        categoria: 'Deportes',
      });

    const id = productoRes.body.id;

    const response = await request(app.getHttpServer())
      .put(`/productos/${id}`)
      .send({
        nombre: 'Balon Pro',
        descripcion: 'Balon profesional',
        precio: 500,
        categoria: 'Deportes',
      })
      .expect(200);

    expect(response.body.nombre).toBe('Balon Pro');
    expect(response.body.precio).toBe(500);
  });

  it('POST /productos/:id/activar - deberia activar un producto', async () => {
    // Crear categoría
    await request(app.getHttpServer())
      .post('/categorias')
      .send({
        nombre: 'Tecnologia',
        descripcion: 'Categoria tecnologia',
      });

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/productos')
      .send({
        nombre: 'Laptop',
        descripcion: 'Laptop gamer',
        precio: 15000,
        categoria: 'Tecnologia',
      });

    const id = productoRes.body.id;

    await request(app.getHttpServer())
      .post(`/productos/${id}/activar`)
      .expect(201);
  });

  it('POST /productos/:id/desactivar - deberia desactivar un producto', async () => {
    // Crear categoría
    await request(app.getHttpServer())
      .post('/categorias')
      .send({
        nombre: 'Accesorios',
        descripcion: 'Categoria accesorios',
      });

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/productos')
      .send({
        nombre: 'Reloj',
        descripcion: 'Reloj inteligente',
        precio: 5000,
        categoria: 'Accesorios',
      });

    const id = productoRes.body.id;

    await request(app.getHttpServer())
      .post(`/productos/${id}/desactivar`)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});