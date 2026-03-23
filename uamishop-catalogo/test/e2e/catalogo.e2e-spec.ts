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
  },
}));

describe('Catalogo (e2e)', () => {
  let app: INestApplication<App>;
  let productoId: string;
  let categoriaId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('DataSource')
      .useValue(undefined)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    // Creamos un producto antes de cada test para que la base de datos no esté vacía
    const catRes = await request(app.getHttpServer()).post('/v1/categorias').send({
      nombre: 'Base',
      descripcion: 'Base',
    });
    categoriaId = catRes.body.id;

    const prodRes = await request(app.getHttpServer()).post('/v1/productos').send({
      nombre: 'Producto Base',
      descripcion: 'Descripcion Producto Base',
      precio: 10,
      categoriaId: categoriaId,
    });
    productoId = prodRes.body.id;
  });

  it('/productos (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/productos')
      .expect(200);

    // Verifica que devuelva un arreglo
    expect(Array.isArray(response.body)).toBe(true);

    // expect(response.body.categoriaId).toBe(categoriaId);
    // expect(response.body.descripcion).toBe('Descripcion Producto Base');
    // expect(response.body.disponible).toBe(false);
    // expect(response.body.fechaCreacion).toBeDefined();
    // expect(response.body.id).toBe(productoId);
    // expect(response.body.imagenes).toEqual([]);
    // expect(response.body.nombre).toBe('Producto Base');
    // expect(response.body.precio).toEqual({ cantidad: 10, moneda: 'MXN' });
  });

  it('POST /categorias - deberia crear una categoria', async () => {
    const response = await request(app.getHttpServer())
      .post('/v1/categorias')
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
      .post('/v1/categorias')
      .send({
        nombre: 'Ropa',
        descripcion: 'Categoria de ropa',
      });

    const response = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Camisa',
        descripcion: 'Camisa blanca',
        precio: 200,
        categoriaId: categoriaRes.body.id,
      })
      .expect(201);

    productoId = response.body.id;

    expect(response.body).toHaveProperty('id');
    expect(response.body.nombre).toBe('Camisa');
    expect(response.body.precio).toEqual({ cantidad: 200, moneda: 'MXN' });
  });

  it('GET /productos - deberia obtener todos los productos', async () => {
    const response = await request(app.getHttpServer())
      .get('/v1/productos')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /productos/:id - deberia obtener un producto por id', async () => {
    // Crear categoría
    const categoriaRes = await request(app.getHttpServer())
      .post('/v1/categorias')
      .send({
        nombre: 'Libros',
        descripcion: 'Categoria libros',
      });

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Libro JS',
        descripcion: 'Aprende JS',
        precio: 150,
        categoriaId: categoriaRes.body.id,
      });

    const id = productoRes.body.id;

    const response = await request(app.getHttpServer())
      .get(`/v1/productos/${id}`)
      .expect(200);

    expect(response.body.id).toBe(id);
    expect(response.body.nombre).toBe('Libro JS');
  });

  it('PUT /productos/:id - deberia actualizar un producto', async () => {
    // Crear categoría
    const catRes = await request(app.getHttpServer()).post('/v1/categorias').send({
      nombre: 'Deportes',
      descripcion: 'Categoria deportes',
    });
    const categoriaIdRes = catRes.body.id;

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Balon',
        descripcion: 'Balon futbol',
        precio: 300,
        categoriaId: categoriaIdRes,
      });

    const id = productoRes.body.id;

    const response = await request(app.getHttpServer())
      .put(`/v1/productos/${id}`)
      .send({
        nombre: 'Balon Pro',
        descripcion: 'Balon profesional',
        precio: 400, // 300 * 1.5 = 450, so 400 is valid
        categoriaId: categoriaIdRes,
      })
      .expect(200);

    expect(response.body.nombre).toBe('Balon Pro');
    expect(response.body.precio).toEqual({ cantidad: 400, moneda: 'MXN' });
  });

  it('POST /productos/:id/activar - deberia activar un producto', async () => {
    // Crear categoría
    const catRes = await request(app.getHttpServer()).post('/v1/categorias').send({
      nombre: 'Tecnologia',
      descripcion: 'Categoria tecnologia',
    });
    const categoriaIdRes = catRes.body.id;

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Laptop',
        descripcion: 'Laptop gamer',
        precio: 15000,
        categoriaId: categoriaIdRes,
      });

    const id = productoRes.body.id;

    // Agregar imagen
    await request(app.getHttpServer())
      .post(`/v1/productos/${id}/imagenes`)
      .send({
        url: 'https://example.com/image.png',
        alt: 'alt',
        orden: 1,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/v1/productos/${id}/activar`)
      .expect(201);
  });

  it('POST /productos/:id/desactivar - deberia desactivar un producto', async () => {
    // Crear categoría
    const catRes = await request(app.getHttpServer()).post('/v1/categorias').send({
      nombre: 'Accesorios',
      descripcion: 'Categoria accesorios',
    });
    const categoriaIdRes = catRes.body.id;

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Reloj',
        descripcion: 'Reloj inteligente',
        precio: 5000,
        categoriaId: categoriaIdRes,
      });

    const id = productoRes.body.id;

    // Agregar imagen
    await request(app.getHttpServer())
      .post(`/v1/productos/${id}/imagenes`)
      .send({
        url: 'https://example.com/image.png',
        alt: 'alt',
        orden: 1,
      })
      .expect(201);

    // Activar
    await request(app.getHttpServer())
      .post(`/v1/productos/${id}/activar`)
      .expect(201);

    // Desactivar
    await request(app.getHttpServer())
      .post(`/v1/productos/${id}/desactivar`)
      .expect(201);
  });

  it('GET /productos/mas-vendidos - deberia obtener los productos mas vendidos', async () => {
    const response = await request(app.getHttpServer())
      .get('/productos/mas-vendidos')
      .query({ limit: 5 })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /productos/:id/estadisticas - deberia obtener las estadisticas de un producto', async () => {
    // Crear categoría
    const catRes = await request(app.getHttpServer()).post('/v1/categorias').send({
      nombre: 'Estadisticas',
      descripcion: 'Categoria estadisticas',
    });
    const categoriaIdRes = catRes.body.id;

    // Crear producto
    const productoRes = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Producto Estadisticas',
        descripcion: 'Descripcion Estadisticas',
        precio: 100,
        categoriaId: categoriaIdRes,
      });

    const id = productoRes.body.id;

    // "Warm up" las estadísticas agregando al carrito
    const clienteId = '550e8400-e29b-41d4-a716-446655440003';
    await request(app.getHttpServer())
      .post(`/carritos/${clienteId}`)
      .expect(201);

    // Suponemos que el id del carrito se puede obtener,
    // pero para simplificar, si el listener funciona, con un carrito basta.
    // Buscamos el carrito creado para ese cliente (o usamos el id devuelto)
    const carritoId = clienteId;

    const carritoRes = await request(app.getHttpServer())
      .post(`/carritos/${clienteId}`)
      .expect(201);
    const actualCarritoId = carritoRes.body.id;

    await request(app.getHttpServer())
      .post(`/carritos/${actualCarritoId}/productos`)
      .send({
        productoRef: {
          productoId: id,
          nombreProducto: 'Producto Estadisticas',
          sku: 'SKU-STATS',
        },
        cantidad: 1,
        precioUnitario: 100,
      })
      .expect(201);

    // Esperar un poco a que se procese el evento asíncrono
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Ahora las estadísticas deberían existir
    const response = await request(app.getHttpServer())
      .get(`/productos/${id}/estadisticas`)
      .expect(200);

    expect(response.body).toHaveProperty('productoId', id);
    expect(response.body.vecesAgregadoAlCarrito).toBeGreaterThan(0);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
