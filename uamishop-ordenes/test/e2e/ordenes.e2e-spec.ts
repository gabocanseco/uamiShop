import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { describe, it, expect, beforeEach, afterAll, vi } from 'vitest';
import { AppModule } from '../../src/app.module';
import { GlobalExceptionFilter } from '../../src/shared/controller/filters/global-exception.filter';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

vi.mock('@golevelup/nestjs-rabbitmq', () => ({
  AmqpConnection: class {
    publish = vi.fn().mockResolvedValue(true);
    channel = { close: vi.fn() };
  },
}));

describe('Ordenes (e2e)', () => {
  let app: INestApplication<App>;
  const BASE_URL = '/v1/ordenes';
  const CLIENTE_ID = 'f79d6f9e-65c7-4f01-851d-af9be6bce3ab';
  let PRODUCTO_ID = '7b80a6e7-5874-4ddb-8492-86b7808445cb';
  const UNPROCESSABLE_ENTITY_CODE = 422;
  let ordenIdCreada: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('DataSource')
      .useValue(undefined)
      .overrideProvider('VentasApi')
      .useValue({
        obtenerResumenCarrito: vi.fn().mockResolvedValue({
          clienteId: CLIENTE_ID,
          items: [],
        }),
      })
      .overrideProvider(AmqpConnection)
      .useValue({
        publish: vi.fn().mockResolvedValue(true),
        channel: { close: vi.fn() },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new GlobalExceptionFilter());

    await app.init();
  });

  beforeEach(async () => {
    // Crear nueva categoria
    const res_categorias = await request(app.getHttpServer())
      .post('/v1/categorias')
      .send({
        nombre: 'Electrónica',
      });
    const categoriaId = res_categorias.body.id;

    // Crear nuevo producto
    const res_productos = await request(app.getHttpServer())
      .post('/v1/productos')
      .send({
        nombre: 'Samsung S21',
        descripcion: 'Smartphone Samsung S21',
        precio: 20499.99,
        categoriaId: categoriaId, // Reemplaza con el ID de la categoría real
      });
    PRODUCTO_ID = res_productos.body.id;

    // Creamos una nueva orden antes de cada test para que la base de datos no esté vacía
    const res = await request(app.getHttpServer())
      .post(BASE_URL)
      .send({
        clienteId: CLIENTE_ID,
        items: [
          {
            productoId: PRODUCTO_ID,
            nombreProducto: 'Samsung',
            sku: 'sam-s21-bk',
            cantidad: 4,
            precioUnitario: 20499.99,
          },
        ],
        direccion: {
          nombreDestinatario: 'Diego',
          calle: 'Calle ejemplo',
          ciudad: 'cdmx',
          estado: 'cdmx',
          codigoPostal: '05000',
          pais: 'Mexico',
          telefono: '1212121212',
          instrucciones: 'Tocar el timbre',
        },
        resumenPago: {
          metodoPago: 'Tarjeta Crédito',
        },
      });

    ordenIdCreada = res.body.id;
  });

  describe(`${BASE_URL} (GET)`, async () => {
    it('Obtener todas las ordenes', async () => {
      const response = await request(app.getHttpServer())
        .get(BASE_URL)
        .expect(200);

      // Verifica que devuelva un arreglo
      expect(Array.isArray(response.body)).toBe(true);

      // Verificar que exista la orden creada
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe(`${BASE_URL}/id (GET)`, async () => {
    it('Obtener una orden por id', async () => {
      const response = await request(app.getHttpServer())
        .get(`${BASE_URL}/${ordenIdCreada}`)
        .expect(200);

      // Verifica que devuelva un arreglo
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(ordenIdCreada);
      expect(response.body.clienteId).toBe(CLIENTE_ID);
      expect(response.body.estado).toBe('PENDIENTE');
      // Verifica que devuelva un arreglo
      expect(Array.isArray(response.body.historialEstados)).toBe(true);
      // Verificar que exista un estado en el historial
      expect(response.body.historialEstados.length).toEqual(1);
    });
  });

  describe(`${BASE_URL}/id (POST)`, async () => {
    it('Confirmar una orden', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/confirmar`)
        .expect(201);

      // Verifica que devuelva un arreglo
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(ordenIdCreada);
      expect(response.body.clienteId).toBe(CLIENTE_ID);
      // Verificar que la orden se encuentra en estado CONFIRMADA
      expect(response.body.estado).toBe('CONFIRMADA');
      // Verifica que devuelva un arreglo
      expect(Array.isArray(response.body.historialEstados)).toBe(true);
      // Verificar que exista un estado en el historial
      expect(response.body.historialEstados.length).toEqual(2);
    });
  });

  describe(`${BASE_URL}/procesar (POST)`, async () => {
    it('No se puede procesar un pago si la orden no ha sido confirmada', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/procesar`)
        .send({
          referenciaExterna: '112234345523453121',
        })
        .expect(UNPROCESSABLE_ENTITY_CODE);
    });
  });

  describe(`${BASE_URL}/enproceso (POST)`, async () => {
    it('No se puede marcar en proceso una orden si el pago no ha sido procesado', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/enproceso`)
        .expect(UNPROCESSABLE_ENTITY_CODE);
    });
  });

  describe(`${BASE_URL}/enviada (POST)`, async () => {
    it('No se puede marcar una orden como enviada si no ha sido marcada en proceso', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/enviada`)
        .send({
          proveedorLogistico: 'DHL',
          numeroGuia: 'asdasd13423',
          fechaEstimadaEntrega: '2026-09-02',
        })
        .expect(UNPROCESSABLE_ENTITY_CODE);
    });
  });

  describe(`${BASE_URL}/entregada (POST)`, async () => {
    it('No se puede marcar una orden como ENTREGADA si no estaba marcada como ENVIADA', async () => {
      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/entregada`)
        .expect(UNPROCESSABLE_ENTITY_CODE);
    });
  });

  describe(`${BASE_URL}/cancelar (POST)`, async () => {
    it('No se puede cancelar una orden que fue enviada', async () => {
      await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/confirmar`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/procesar`)
        .send({
          referenciaExterna: '112234345523453121',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/enproceso`)
        .expect(201);

      await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/enviada`)
        .send({
          proveedorLogistico: 'DHL',
          numeroGuia: 'asdasd13423',
          fechaEstimadaEntrega: '2026-09-02',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`${BASE_URL}/${ordenIdCreada}/cancelar`)
        .send({
          motivo: 'Ya no quiero el producto',
        })
        .expect(UNPROCESSABLE_ENTITY_CODE);
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
