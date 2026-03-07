import { Test, TestingModule } from '@nestjs/testing';
import { CarritoService } from './carrito.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CarritoInMemoryRepository } from '@ventas/repository/carrito-in-memory.repository';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
import { EstadoCarrito } from '@ventas/domain/enums/estado-carrito.enum';

describe('CarritoService', () => {
    let service: CarritoService;
    let repository: CarritoInMemoryRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CarritoService,
                {
                    provide: 'ICarritoRepository',
                    useClass: CarritoInMemoryRepository,
                },
            ],
        }).compile();

        service = module.get<CarritoService>(CarritoService);
        repository = module.get<CarritoInMemoryRepository>('ICarritoRepository');
    });

    it('debe estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('crear', () => {
        it('debe crear un carrito nuevo para un cliente', async () => {
            const clienteId = ClienteId.generar();
            const carrito = await service.crear(clienteId);

            expect(carrito).toBeDefined();
            expect(carrito.getClienteId().getValue()).toBe(clienteId.getValue());
            expect(carrito.getEstado()).toBe(EstadoCarrito.ACTIVO);

            const guardado = await repository.findById(carrito.getId());
            expect(guardado).toBeDefined();
        });
    });

    describe('obtenerCarrito', () => {
        it('debe obtener un carrito existente', async () => {
            const clienteId = ClienteId.generar();
            const creado = await service.crear(clienteId);

            const encontrado = await service.obtenerCarrito(creado.getId());

            expect(encontrado.getId().getValue()).toBe(creado.getId().getValue());
        });

        it('debe lanzar EntityNotFoundException si el carrito no existe', async () => {
            const carritoId = CarritoId.generar();

            await expect(service.obtenerCarrito(carritoId)).rejects.toThrow(EntityNotFoundException);
        });
    });

    describe('gestion de productos', () => {
        let carritoId: CarritoId;
        const productoId = ProductoId.of('fec96173-7df5-4a45-a162-5d1cca312467');
        const productoRef = ProductoRef.crear(
            productoId,
            NombreProducto.crear('Laptop'),
            'LPT-001'
        );
        const precio = Money.crear(1000);

        beforeEach(async () => {
            const carrito = await service.crear(ClienteId.generar());
            carritoId = carrito.getId();
        });

        it('debe agregar un producto al carrito', async () => {
            const carrito = await service.agregarProducto(carritoId, productoRef, 2, precio);

            expect(carrito.getItems()).toHaveLength(1);
            expect(carrito.getItems()[0].toPrimitives().productoRef.productoId).toBe(productoId.getValue());
            expect(carrito.getItems()[0].toPrimitives().cantidad).toBe(2);
        });

        it('debe modificar la cantidad de un producto', async () => {
            await service.agregarProducto(carritoId, productoRef, 2, precio);
            const carrito = await service.modificarCantidad(carritoId, productoId, 5);

            expect(carrito.getItems()[0].toPrimitives().cantidad).toBe(5);
        });

        it('debe eliminar un producto del carrito', async () => {
            await service.agregarProducto(carritoId, productoRef, 2, precio);
            const carrito = await service.eliminarProducto(carritoId, productoId);

            expect(carrito.getItems()).toHaveLength(0);
        });

        it('debe vaciar el carrito', async () => {
            await service.agregarProducto(carritoId, productoRef, 2, precio);
            const carrito = await service.vaciar(carritoId);

            expect(carrito.getItems()).toHaveLength(0);
        });
    });

    describe('flujo de checkout', () => {
        let carritoId: CarritoId;

        beforeEach(async () => {
            const carrito = await service.crear(ClienteId.generar());
            carritoId = carrito.getId();
            // Agregar producto para permitir checkout
            await service.agregarProducto(
                carritoId,
                ProductoRef.crear(ProductoId.generar(), NombreProducto.crear('Test'), 'SKU'),
                1,
                Money.crear(10)
            );
        });

        it('debe iniciar el checkout', async () => {
            const carrito = await service.iniciarCheckout(carritoId);
            expect(carrito.getEstado()).toBe(EstadoCarrito.EN_CHECKOUT);
        });

        it('debe completar el checkout', async () => {
            await service.iniciarCheckout(carritoId);
            const carrito = await service.completarCheckout(carritoId);
            expect(carrito.getEstado()).toBe(EstadoCarrito.COMPLETADO);
        });

        it('debe abandonar el carrito', async () => {
            const carrito = await service.abandonar(carritoId);
            expect(carrito.getEstado()).toBe(EstadoCarrito.ABANDONADO);
        });
    });

    describe('obtenerResumenCarrito', () => {
        it('debe retornar el resumen del carrito', async () => {
            const carrito = await service.crear(ClienteId.generar());
            const resumen = await service.obtenerResumenCarrito(carrito.getId());

            expect(resumen).toBeDefined();
            expect(resumen.items).toBeDefined();
        });
    });
});
