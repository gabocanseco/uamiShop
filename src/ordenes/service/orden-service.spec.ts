import { Test, TestingModule } from '@nestjs/testing';
import { OrdenService } from './orden.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { OrdenInMemoryRepository } from '@ordenes/repository/orden-in-memory.repository';
import { INestApplication } from '@nestjs/common';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
import { ResumenPago } from '@ordenes/domain/value-objects/resumen-pago.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { IOrdenRepository } from '@ordenes/repository/interfaces/orden.repository';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
import { UUID } from '@shared/domain/value-objects/uuid.vo';
import { ItemOrden } from '@ordenes/domain/entities/item-orden.entity';
import { EstadoOrden } from '@ordenes/domain/enums/estado-orden.enum';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { OrdenCreadaEvent } from '@shared/event/orden-creada.event';
import { vi } from 'vitest';

describe('Pruebas del OrdenService', () => {
  let service: OrdenService;
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let ventasApiMock: any;

  beforeEach(async () => {
    ventasApiMock = {
      obtenerResumenCarrito: vi.fn(),
    };

    const moduleFixtureRes = await Test.createTestingModule({
      providers: [
        OrdenService,
        { provide: 'IOrdenRepository', useClass: OrdenInMemoryRepository },
        {
          provide: 'VentasApi',
          useValue: ventasApiMock,
        },
        {
          provide: EventEmitter2,
          useValue: { emit: vi.fn() }, // Un mock simple con Vitest
        },
      ],
    }).compile();

    moduleFixture = moduleFixtureRes;
    app = moduleFixture.createNestApplication();
    service = moduleFixture.get<OrdenService>(OrdenService);
    await app.init();
  });

  describe('OrdenService.crear', () => {
    it('debe crear una orden y emitir eventos', async () => {
      const clienteId = ClienteId.of(UUID.random());
      const items = [
        ItemOrden.crear(
          ProductoId.of(UUID.random()),
          'Laptop',
          'lptp-12311',
          1,
          Money.crear(1000, 'MXN'),
        ),
      ];
      const direccion = DireccionEnvio.crear(
        'Juan Perez',
        'Vasco de Quiroga',
        'CDMX',
        'CDMX',
        '50000',
        'México',
        '5598436517',
        'Casa blanca',
      );
      const pago = ResumenPago.crear('Tarjeta Débito');
      const nuevaOrden = Orden.crear(clienteId, items, direccion, pago);

      const resultado = await service.crear(nuevaOrden);

      expect(resultado).toBeDefined();
      expect(resultado.getId()).toBe(nuevaOrden.getId());

      const eventEmitter = moduleFixture.get<EventEmitter2>(EventEmitter2);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'orden.creada',
        expect.any(OrdenCreadaEvent),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'orden.producto.comprado',
        expect.any(Object),
      );
    });
  });

  describe('Ordenservice.buscarPorId', () => {
    it('debe lanzar excepcion si la orden no existe', async () => {
      const ordenIdInexistente = OrdenId.of(UUID.random());

      await expect(service.buscarPorId(ordenIdInexistente)).rejects.toThrow(
        EntityNotFoundException,
      );
    });
  });

  describe('Crear Orden desde Carrito', () => {
    const clienteIdStr = 'e9145a75-d6cf-499d-87f2-f77a8480f20c';
    const carritoResumenDtoMock = () => ({
      // carritoId: '123e4567-e89b-12d3-a456-426614174000',
      clienteId: clienteIdStr,
      items: [
        {
          productoRef: {
            productoId: 'fec96173-7df5-4a45-a162-5d1cca312467',
            nombreProducto: 'Laptop',
            sku: 'lptp-12311',
          },
          cantidad: 2,
          precioUnitario: {
            cantidad: 200,
            moneda: 'MXN',
          },
        },
      ],
    });

    const direccionEnvio = DireccionEnvio.crear(
      'Diego',
      'calle test',
      'cdmx',
      'cdmx',
      '05000',
      'Mexico',
      '1212121212',
      'dejelo afuera',
    );

    it('No se puede cerar una orden desde un carrito vacio', async () => {
      const carritoId = CarritoId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      const dtoMock = carritoResumenDtoMock();
      dtoMock.items = []; // Simular carrito vacío
      ventasApiMock.obtenerResumenCarrito.mockResolvedValue(dtoMock);

      const resumenPago = ResumenPago.crear('Paypal');

      await expect(
        service.crearDesdeCarrito(carritoId, direccionEnvio, resumenPago),
      ).rejects.toThrow(BusinessRuleException);
    });

    it('Crear una orden desde un carrito existente', async () => {
      const carritoId = CarritoId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      const resumenPago = ResumenPago.crear('Paypal');
      const dtoConItemsMock = carritoResumenDtoMock();
      ventasApiMock.obtenerResumenCarrito.mockResolvedValue(dtoConItemsMock);

      const nuevaOrden = await service.crearDesdeCarrito(
        carritoId,
        direccionEnvio,
        resumenPago,
      );

      expect(nuevaOrden).toBeDefined();
      expect(nuevaOrden.toPrimitives().clienteId).toBe(clienteIdStr);

      // Verificar emisión de eventos
      const eventEmitter = moduleFixture.get<EventEmitter2>(EventEmitter2);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'orden.creada',
        expect.any(OrdenCreadaEvent),
      );
    });
  });

  describe('OrdenService.confirmar', () => {
    let orden: Orden;
    let ordenId: OrdenId;
    let clienteId: ClienteId;
    let repository: IOrdenRepository;
    let productoId: ProductoId;

    beforeEach(async () => {
      clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      productoId = ProductoId.of(UUID.random());
      const items = [
        ItemOrden.crear(
          productoId,
          'Laptop',
          'lptp-12311',
          2,
          Money.crear(200, 'MXN'),
        ),
      ];

      const direccionEnvio = DireccionEnvio.crear(
        'Diego',
        'calle test',
        'cdmx',
        'cdmx',
        '05000',
        'Mexico',
        '1212121212',
        'dejelo afuera',
      );
      const resumenPago = ResumenPago.crear('Paypal');

      orden = Orden.crear(clienteId, items, direccionEnvio, resumenPago);
      ordenId = orden.getId();

      repository = app.get<IOrdenRepository>('IOrdenRepository');
      await repository.save(orden);
    });

    it('debe confirmar la orden', async () => {
      // Act
      const ordenActualizada = await service.confirmar(ordenId);

      // Asserts
      expect(ordenActualizada.toPrimitives().estado).toBe('CONFIRMADA');
    });
  });

  describe('OrdenService.procesarPago', () => {
    let orden: Orden;
    let ordenId: OrdenId;
    let clienteId: ClienteId;
    let repository: IOrdenRepository;
    let productoId: ProductoId;

    beforeEach(async () => {
      clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      productoId = ProductoId.of(UUID.random());
      const items = [
        ItemOrden.crear(
          productoId,
          'Laptop',
          'lptp-12311',
          2,
          Money.crear(200, 'MXN'),
        ),
      ];

      const direccionEnvio = DireccionEnvio.crear(
        'Diego',
        'calle test',
        'cdmx',
        'cdmx',
        '05000',
        'Mexico',
        '1212121212',
        'dejelo afuera',
      );
      const resumenPago = ResumenPago.crear('Paypal');

      orden = Orden.crear(clienteId, items, direccionEnvio, resumenPago);
      ordenId = orden.getId();

      repository = app.get<IOrdenRepository>('IOrdenRepository');
      await repository.save(orden);
    });
    it('debe lanzar excepcion si el estado de la orden no es confirmada', async () => {
      await expect(service.procesarPago(ordenId, 'REF-12345')).rejects.toThrow(
        BusinessRuleException,
      );

      // Verificar que el estado de la orden no se haya actualizado
      const ordenGuardada = await repository.findById(ordenId);
      expect(ordenGuardada).toBeDefined();
      expect(ordenGuardada?.getEstado()).toBe(EstadoOrden.PENDIENTE);
    });
  });

  describe('OrdenService.marcarEnProceso', () => {
    let orden: Orden;
    let ordenId: OrdenId;
    let clienteId: ClienteId;
    let repository: IOrdenRepository;
    let productoId: ProductoId;

    beforeEach(async () => {
      clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      productoId = ProductoId.of(UUID.random());
      const items = [
        ItemOrden.crear(
          productoId,
          'Laptop',
          'lptp-12311',
          2,
          Money.crear(200, 'MXN'),
        ),
      ];

      const direccionEnvio = DireccionEnvio.crear(
        'Diego',
        'calle test',
        'cdmx',
        'cdmx',
        '05000',
        'Mexico',
        '1212121212',
        'dejelo afuera',
      );
      const resumenPago = ResumenPago.crear('Paypal');

      orden = Orden.crear(clienteId, items, direccionEnvio, resumenPago);
      ordenId = orden.getId();

      repository = app.get<IOrdenRepository>('IOrdenRepository');
      await repository.save(orden);
    });
    it('debe lanzar excepcion si el estado de la orden no esta aprobada', async () => {
      await expect(service.marcarEnProceso(ordenId)).rejects.toThrow(
        BusinessRuleException,
      );

      // Verificar que el estado de la orden no se haya actualizado
      const ordenGuardada = await repository.findById(ordenId);
      expect(ordenGuardada).toBeDefined();
      expect(ordenGuardada?.getEstado()).toBe(EstadoOrden.PENDIENTE);
    });
  });

  describe('OrdenService.marcarEnviada', () => {
    let orden: Orden;
    let ordenId: OrdenId;
    let clienteId: ClienteId;
    let repository: IOrdenRepository;
    let productoId: ProductoId;

    beforeEach(async () => {
      clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      productoId = ProductoId.of(UUID.random());
      const items = [
        ItemOrden.crear(
          productoId,
          'Laptop',
          'lptp-12311',
          2,
          Money.crear(200, 'MXN'),
        ),
      ];

      const direccionEnvio = DireccionEnvio.crear(
        'Diego',
        'calle test',
        'cdmx',
        'cdmx',
        '05000',
        'Mexico',
        '1212121212',
        'dejelo afuera',
      );
      const resumenPago = ResumenPago.crear('Paypal');

      orden = Orden.crear(clienteId, items, direccionEnvio, resumenPago);
      ordenId = orden.getId();

      repository = app.get<IOrdenRepository>('IOrdenRepository');
      await repository.save(orden);
    });
    it('debe lanzar excepcion si el estado de la orden no esta en preparacion', async () => {
      const infoEnvio = InfoEnvio.crear(
        'FedEx',
        'GUIA1234567890',
        DateTime.now(),
      );

      await expect(service.marcarEnviada(ordenId, infoEnvio)).rejects.toThrow(
        BusinessRuleException,
      );

      // Verificar que el estado de la orden no se haya actualizado
      const ordenGuardada = await repository.findById(ordenId);
      expect(ordenGuardada).toBeDefined();
      expect(ordenGuardada?.getEstado()).toBe(EstadoOrden.PENDIENTE);
    });
  });

  describe('OrdenService.marcarEntregada', () => {
    let orden: Orden;
    let ordenId: OrdenId;
    let clienteId: ClienteId;
    let repository: IOrdenRepository;
    let productoId: ProductoId;

    beforeEach(async () => {
      clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      productoId = ProductoId.of(UUID.random());
      const items = [
        ItemOrden.crear(
          productoId,
          'Laptop',
          'lptp-12311',
          2,
          Money.crear(200, 'MXN'),
        ),
      ];

      const direccionEnvio = DireccionEnvio.crear(
        'Diego',
        'calle test',
        'cdmx',
        'cdmx',
        '05000',
        'Mexico',
        '1212121212',
        'dejelo afuera',
      );
      const resumenPago = ResumenPago.crear('Paypal');

      orden = Orden.crear(clienteId, items, direccionEnvio, resumenPago);
      ordenId = orden.getId();

      repository = app.get<IOrdenRepository>('IOrdenRepository');
      await repository.save(orden);
    });

    it('debe lanzar excepcion si el estado de la orden no esta enviada o en transito', async () => {
      await expect(service.marcarEntregada(ordenId)).rejects.toThrow(
        BusinessRuleException,
      );

      // Verificar que el estado de la orden no se haya actualizado
      const ordenGuardada = await repository.findById(ordenId);
      expect(ordenGuardada).toBeDefined();
      expect(ordenGuardada?.getEstado()).toBe(EstadoOrden.PENDIENTE);
    });
  });

  describe('OrdenService.cancelar', () => {
    let orden: Orden;
    let ordenId: OrdenId;
    let clienteId: ClienteId;
    let repository: IOrdenRepository;
    let productoId: ProductoId;

    beforeEach(async () => {
      clienteId = ClienteId.of('e9145a75-d6cf-499d-87f2-f77a8480f20c');
      productoId = ProductoId.of(UUID.random());
      const items = [
        ItemOrden.crear(
          productoId,
          'Laptop',
          'lptp-12311',
          2,
          Money.crear(200, 'MXN'),
        ),
      ];

      const direccionEnvio = DireccionEnvio.crear(
        'Diego',
        'calle test',
        'cdmx',
        'cdmx',
        '05000',
        'Mexico',
        '1212121212',
        'dejelo afuera',
      );
      const resumenPago = ResumenPago.crear('Paypal');

      orden = Orden.crear(clienteId, items, direccionEnvio, resumenPago);
      ordenId = orden.getId();

      repository = app.get<IOrdenRepository>('IOrdenRepository');
      await repository.save(orden);
    });

    it('debe lanzar excepcion si el estado de la orden es enviada o entregada', async () => {
      await service.confirmar(ordenId);

      await service.procesarPago(ordenId, 'REF-12345');

      await service.marcarEnProceso(ordenId);

      const infoEnvio = InfoEnvio.crear(
        'FedEx',
        'GUIA1234567890',
        DateTime.now(),
      );
      await service.marcarEnviada(ordenId, infoEnvio);

      await expect(
        service.cancelar(ordenId, 'Ya no lla quiero'),
      ).rejects.toThrow(BusinessRuleException);

      // Verificar que el estado de la orden no se haya actualizado
      const ordenGuardada = await repository.findById(ordenId);
      expect(ordenGuardada).toBeDefined();
      expect(ordenGuardada?.getEstado()).toBe(EstadoOrden.ENVIADA);
    });
  });
});
