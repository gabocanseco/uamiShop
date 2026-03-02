import { CarritoController } from './carrito.controller';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
import { CarritoResponseDto } from './dtos/carrito-response.dto';
import { ClienteParamDto } from '@shared/controller/dtos/cliente-params.dto';
import { CarritoParamDto } from './dtos/carrito-params.dto';
import { CarritoRequestDto, ProductoRefDto } from './dtos/carrito-request.dto';
import { ProductoRefMapper } from './mappers/carrito.mapper';
import { vi } from 'vitest';

// Mocks para pruebas unitarias
class DummyCarrito {
  constructor(private payload: any) {}
  toPrimitives() {
    return this.payload;
  }
}

describe('CarritoController (unit)', () => {
  let controller: CarritoController;
  let carritoService: any;

  beforeEach(() => {
    carroServiceMock:
    carritoService = {
      crear: vi.fn(),
      obtenerCarrito: vi.fn(),
      agregarProducto: vi.fn(),
    };
    controller = new CarritoController(carritoService);
  });

  it('debería crear un carrito y devolver DTO a partir de la entidad', async () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const primitives = { id: 'a', clienteId: validUuid };
    const domain = new DummyCarrito(primitives);
    carritoService.crear.mockResolvedValue(domain);

    const result = await controller.crear({ id: validUuid } as ClienteParamDto);
    expect(result).toEqual(primitives);
    expect(carritoService.crear).toHaveBeenCalledWith(expect.any(Object));
  });

  it('debería crear un carrito cuando el servicio devuelve un objeto plano', async () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const plain = { id: 'b', clienteId: validUuid };
    carritoService.crear.mockResolvedValue(plain);

    const result = await controller.crear({ id: validUuid } as ClienteParamDto);
    expect(result).toEqual(plain);
  });

  it('debería propagar excepción cuando no se encuentra el carrito', async () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    carritoService.obtenerCarrito.mockRejectedValue(
      new EntityNotFoundException('Carrito', validUuid),
    );

    await expect(
      controller.obtenerCarrito({ id: validUuid } as CarritoParamDto),
    ).rejects.toBeInstanceOf(EntityNotFoundException);
  });

  it('al agregar producto llama al servicio con valores convertidos', async () => {
    const dto: CarritoRequestDto = {
      clienteId: 'c',
      productoRef: {
        productoId: '550e8400-e29b-41d4-a716-446655440000',
        nombreProducto: 'test',
        sku: 'sku',
      } as ProductoRefDto,
      cantidad: 2,
      precioUnitario: 10,
    } as any;

    const primitives = { id: 'foo' };
    carritoService.agregarProducto.mockResolvedValue(new DummyCarrito(primitives));

    const validUuid = '550e8400-e29b-41d4-a716-446655440000';
    const resp = await controller.agregarProducto(
      { id: validUuid } as CarritoParamDto,
      dto,
    );

    expect(carritoService.agregarProducto).toHaveBeenCalled();
    expect(resp).toEqual(primitives);
  });
});
