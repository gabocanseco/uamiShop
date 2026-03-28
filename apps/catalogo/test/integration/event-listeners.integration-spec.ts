import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'crypto';
import {
  ItemComprado,
  ProductoCompradoEvent,
} from '@app/shared/event/producto-comprado.event';
import { ProductoAgregadoAlCarritoEvent } from '@app/shared/event/producto-agregado-al-carrito.event';
import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { CatalogoIntegrationTestModule } from './catalogo-integration.module';

/** Espera a manejadores async @OnEvent + transacciones */
async function esperarEfectosIntegracion() {
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setImmediate(r));
  await new Promise((r) => setTimeout(r, 30));
}

describe('Integración — listeners y eventos de dominio (catálogo)', () => {
  let moduleRef: TestingModule;
  let eventEmitter: EventEmitter2;
  let estadisticasService: ProductoEstadisticasService;

  beforeAll(async () => {
    process.env.NODE_ENV = 'catalogo-integration';
    initializeTransactionalContext();
    moduleRef = await Test.createTestingModule({
      imports: [CatalogoIntegrationTestModule],
    }).compile();

    await moduleRef.init();

    eventEmitter = moduleRef.get(EventEmitter2);
    estadisticasService = moduleRef.get(ProductoEstadisticasService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('producto.comprado: persiste ventas en estadísticas (nuevo producto)', async () => {
    const productoId = randomUUID();
    const evento = new ProductoCompradoEvent(
      randomUUID(),
      new Date().toISOString(),
      randomUUID(),
      randomUUID(),
      [new ItemComprado(productoId, 'SKU-1', 4, 10.5, 'MXN')],
    );

    eventEmitter.emit('producto.comprado', evento);
    await esperarEfectosIntegracion();

    const stats = await estadisticasService.obtenerEstadisticas(
      ProductoId.of(productoId),
    );

    expect(stats.getCantidadVendida()).toBe(4);
    expect(stats.getVentasTotales()).toBe(1);
  });

  it('producto.comprado: acumula varias transacciones y varios ítems', async () => {
    const pid1 = randomUUID();
    const pid2 = randomUUID();

    eventEmitter.emit(
      'producto.comprado',
      new ProductoCompradoEvent(
        randomUUID(),
        new Date().toISOString(),
        randomUUID(),
        randomUUID(),
        [
          new ItemComprado(pid1, 'a', 2, 1, 'MXN'),
          new ItemComprado(pid2, 'b', 3, 1, 'MXN'),
        ],
      ),
    );
    await esperarEfectosIntegracion();

    const s1 = await estadisticasService.obtenerEstadisticas(
      ProductoId.of(pid1),
    );
    const s2 = await estadisticasService.obtenerEstadisticas(
      ProductoId.of(pid2),
    );

    expect(s1.getCantidadVendida()).toBe(2);
    expect(s2.getCantidadVendida()).toBe(3);

    eventEmitter.emit(
      'producto.comprado',
      new ProductoCompradoEvent(
        randomUUID(),
        new Date().toISOString(),
        randomUUID(),
        randomUUID(),
        [new ItemComprado(pid1, 'a', 5, 1, 'MXN')],
      ),
    );
    await esperarEfectosIntegracion();

    const s1b = await estadisticasService.obtenerEstadisticas(
      ProductoId.of(pid1),
    );
    expect(s1b.getCantidadVendida()).toBe(7);
    expect(s1b.getVentasTotales()).toBe(2);
  });

  it('producto.agregado-carrito: incrementa contador en persistencia', async () => {
    const productoId = randomUUID();
    const evento = new ProductoAgregadoAlCarritoEvent(
      randomUUID(),
      new Date().toISOString(),
      productoId,
      randomUUID(),
      1,
      10,
      'MXN',
    );

    eventEmitter.emit('producto.agregado-carrito', evento);
    await esperarEfectosIntegracion();

    const stats = await estadisticasService.obtenerEstadisticas(
      ProductoId.of(productoId),
    );

    expect(stats.getVecesAgregadoAlCarrito()).toBe(1);

    eventEmitter.emit('producto.agregado-carrito', evento);
    await esperarEfectosIntegracion();

    const stats2 = await estadisticasService.obtenerEstadisticas(
      ProductoId.of(productoId),
    );
    expect(stats2.getVecesAgregadoAlCarrito()).toBe(2);
  });
});
