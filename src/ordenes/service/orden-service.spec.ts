import { Test, TestingModule } from '@nestjs/testing';
import { OrdenService } from './orden.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { OrdenInMemoryRepository } from '@ordenes/repository/orden-in-memory.repository';
import { CarritoInMemoryRepository } from '@ventas/repository/carrito-in-memory.repository';
import { INestApplication } from '@nestjs/common';
import { Carrito } from '@ventas/domain/agreggates/carrito.agreggate';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
import { ResumenPago } from '@ordenes/domain/value-objects/resumen-pago.vo';
import { CarritoService } from '@ventas/service/carrito.service';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';

describe('OrdenService - Crear desde Carrito', () => {
  let service: OrdenService;
  let app: INestApplication;
  let carritoService: CarritoService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        OrdenService,
        CarritoService,
        { provide: 'IOrdenRepository', useClass: OrdenInMemoryRepository },
        { provide: 'ICarritoRepository', useClass: CarritoInMemoryRepository },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<OrdenService>(OrdenService);
    carritoService = moduleFixture.get<CarritoService>(CarritoService);
  });

  it('No se puede cerar una orden desde un carrito vacio', async () => {
    const clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
    const carritoVacio = await carritoService.crear(clienteId);

    const direccionEnvio = DireccionEnvio.crear(
      'Diego',
      'manuel blabla',
      'cdmx',
      'cdmx',
      '05000',
      'Mexico',
      '1212121212',
      'dejlo afuera',
    );
    const resumenPago = ResumenPago.crear('Paypal');

    await expect(
      service.crearDesdeCarrito(
        carritoVacio.getId(),
        direccionEnvio,
        resumenPago,
      ),
    ).rejects.toThrow(BusinessRuleException);
  });

  it('Crear una orden desde un carrito existente', async () => {
    const clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
    const carritoVacio = await carritoService.crear(clienteId);
    const productoRef = ProductoRef.crear(
      ProductoId.of('fec96173-7df5-4a45-a162-5d1cca312467'),
      NombreProducto.crear('Laptop'),
      'lptp-12311',
    );
    const cantidad = 2;
    const precioUnitario = Money.crear(500);
    const nuevoCarrito = await carritoService.agregarProducto(
      carritoVacio.getId(),
      productoRef,
      cantidad,
      precioUnitario,
    );
    await carritoService.iniciarCheckout(nuevoCarrito.getId());

    const direccionEnvio = DireccionEnvio.crear(
      'Diego',
      'manuel blabla',
      'cdmx',
      'cdmx',
      '05000',
      'Mexico',
      '1212121212',
      'dejlo afuera',
    );
    const resumenPago = ResumenPago.crear('Paypal');

    const nuevaOrden = await service.crearDesdeCarrito(
      nuevoCarrito.getId(),
      direccionEnvio,
      resumenPago,
    );

    expect(nuevaOrden).toBeDefined();
    expect(nuevaOrden.toPrimitives().clienteId).toBe(clienteId.getValue());
  });

  describe('Ciclo de vida de la Orden', () => {
    let orden: Orden;
    let ordenId: OrdenId;

    beforeEach(async () => {
      // Crear una orden base para los tests de estado
      const clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      const carritoVacio = await carritoService.crear(clienteId);
      const productoRef = ProductoRef.crear(
        ProductoId.of('fec96173-7df5-4a45-a162-5d1cca312467'),
        NombreProducto.crear('Laptop'),
        'lptp-12311',
      );
      await carritoService.agregarProducto(
        carritoVacio.getId(),
        productoRef,
        1,
        Money.crear(500),
      );
      await carritoService.iniciarCheckout(carritoVacio.getId());

      const direccionEnvio = DireccionEnvio.crear(
        'Diego', 'Calle 123', 'CDMX', 'CDMX', '05000', 'Mexico', '1212121212', 'Dejar en puerta',
      );
      const resumenPago = ResumenPago.crear('Paypal');

      const nuevaOrden = await service.crearDesdeCarrito(
        carritoVacio.getId(),
        direccionEnvio,
        resumenPago,
      );
      ordenId = nuevaOrden.getId();
    });

    it('debe confirmar la orden', async () => {
      const actualizada = await service.confirmar(ordenId);
      expect(actualizada.toPrimitives().estado).toBe('CONFIRMADA');
    });

    it('debe procesar el pago', async () => {
      await service.confirmar(ordenId);
      const actualizada = await service.procesarPago(ordenId, 'REF-123456');
      expect(actualizada.toPrimitives().estado).toBe('PAGO_PROCESADO');
    });

    it('debe marcar en proceso', async () => {
      await service.confirmar(ordenId);
      await service.procesarPago(ordenId, 'REF-123456');
      const actualizada = await service.marcarEnProceso(ordenId);
      expect(actualizada.toPrimitives().estado).toBe('EN_PREPARACION');
    });

    it('debe marcar como enviada', async () => {
      await service.confirmar(ordenId);
      await service.procesarPago(ordenId, 'REF-123456');
      await service.marcarEnProceso(ordenId);

      const infoEnvio = InfoEnvio.crear(
        'FedEx',
        'GUIA1234567890',
        DateTime.now().addDays(3)
      );
      const actualizada = await service.marcarEnviada(ordenId, infoEnvio);
      expect(actualizada.toPrimitives().estado).toBe('ENVIADA');
    });

    it('debe marcar como entregada', async () => {
      await service.confirmar(ordenId);
      await service.procesarPago(ordenId, 'REF-123456');
      await service.marcarEnProceso(ordenId);
      await service.marcarEnviada(ordenId, InfoEnvio.crear('UPS', 'GUIA0987654321', DateTime.now()));

      const actualizada = await service.marcarEntregada(ordenId);
      expect(actualizada.toPrimitives().estado).toBe('ENTREGADA');
    });

    it('debe cancelar la orden', async () => {
      const actualizada = await service.cancelar(ordenId, 'Cliente arrepentido');
      expect(actualizada.toPrimitives().estado).toBe('CANCELADA');
    });
  });
});
