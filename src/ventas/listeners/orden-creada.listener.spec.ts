import { Test, TestingModule } from '@nestjs/testing';
import { OrdenCreadaListener } from './orden-creada.listener';
import { CarritoService } from '@ventas/service/carrito.service';
import { OrdenCreadaEvent } from '@shared/event/orden-creada.event';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('OrdenCreadaListener', () => {
    let listener: OrdenCreadaListener;
    let carritoService: CarritoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrdenCreadaListener,
                {
                    provide: CarritoService,
                    useValue: {
                        completarCheckout: vi.fn(),
                    },
                },
            ],
        }).compile();

        listener = module.get<OrdenCreadaListener>(OrdenCreadaListener);
        carritoService = module.get<CarritoService>(CarritoService);
    });

    it('debe estar definido', () => {
        expect(listener).toBeDefined();
    });

    it('debe llamar a completarCheckout cuando recibe OrdenCreadaEvent', async () => {
        const carritoId = 'e9145a75-d6cf-499d-87f2-f77a8480f20c';
        const event = new OrdenCreadaEvent(
            'event-id',
            new Date(),
            'orden-id',
            carritoId,
            'cliente-id',
        );

        await listener.onOrdenCreada(event);

        expect(carritoService.completarCheckout).toHaveBeenCalledWith(
            expect.objectContaining({
                value: carritoId,
            }),
        );
    });
});
