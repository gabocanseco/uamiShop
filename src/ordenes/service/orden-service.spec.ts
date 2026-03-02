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
});
