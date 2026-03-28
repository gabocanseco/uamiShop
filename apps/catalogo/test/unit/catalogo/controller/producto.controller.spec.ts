import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from '@catalogo/controller/producto.controller';
import { ProductoService } from '@catalogo/service/producto.service';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { Money } from '@app/shared/domain/value-objects/money.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { DateTime } from '@app/shared/domain/value-objects/datetime.vo';
import { EntityNotFoundException } from '@app/shared/domain/exceptions/entity-not-found.exception';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ProductoController (unitario)', () => {
  let controller: ProductoController;

  const mockProductoService = {
    crear: vi.fn(),
    buscarTodos: vi.fn(),
    buscarMasVendidos: vi.fn(),
    obtenerProducto: vi.fn(),
    buscarEstadisticas: vi.fn(),
    actualizar: vi.fn(),
    activar: vi.fn(),
    desactivar: vi.fn(),
    agregarImagen: vi.fn(),
    crearCategoria: vi.fn(),
    buscarTodasCategorias: vi.fn(),
    buscarCategoriaPorId: vi.fn(),
    actualizarCategoria: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        {
          provide: ProductoService,
          useValue: mockProductoService,
        },
      ],
    }).compile();

    controller = module.get(ProductoController);
  });

  it('crear devuelve DTO y llama al servicio', async () => {
    const categoriaId = CategoriaId.generar().getValue();
    const request = {
      nombre: 'Teclado',
      descripcion: 'Mecánico',
      precio: 199,
      categoriaId,
    };
    const dominio = Producto.crear(
      NombreProducto.crear(request.nombre),
      DescripcionProducto.crear(request.descripcion),
      Money.crear(request.precio),
      CategoriaId.of(categoriaId),
    );
    mockProductoService.crear.mockResolvedValue(dominio);

    const out = await controller.crear(request);

    expect(mockProductoService.crear).toHaveBeenCalledTimes(1);
    expect(out.id).toBe(dominio.getId().getValue());
    expect(out.nombre).toBe(request.nombre);
    expect(out.precio).toMatchObject({
      cantidad: request.precio,
      moneda: 'MXN',
    });
  });

  it('obtener propaga EntityNotFoundException del servicio', async () => {
    const id = ProductoId.generar().getValue();
    mockProductoService.obtenerProducto.mockRejectedValue(
      new EntityNotFoundException('Producto', id),
    );

    await expect(controller.obtener({ id })).rejects.toThrow(
      EntityNotFoundException,
    );
  });

  it('obtener retorna el DTO que resuelve el servicio', async () => {
    const id = ProductoId.generar().getValue();
    const dto = {
      id,
      nombre: 'Monitor',
      descripcion: '4K',
      precio: { cantidad: 400, moneda: 'MXN' },
      categoriaId: CategoriaId.generar().getValue(),
      disponible: false,
      fechaCreacion: new Date().toISOString(),
      imagenes: [],
    };
    mockProductoService.obtenerProducto.mockResolvedValue(dto);

    const out = await controller.obtener({ id });
    expect(out).toEqual(dto);
    expect(mockProductoService.obtenerProducto).toHaveBeenCalled();
  });

  it('estadisticas mapea el resultado del servicio', async () => {
    const id = ProductoId.generar().getValue();
    const stats = ProductoEstadisticas.reconstruct(
      ProductoId.of(id),
      2,
      8,
      3,
      DateTime.now(),
      DateTime.now(),
    );
    mockProductoService.buscarEstadisticas.mockResolvedValue(stats);

    const out = await controller.estadisticas({ id });

    expect(mockProductoService.buscarEstadisticas).toHaveBeenCalled();
    expect(out.productoId).toBe(id);
    expect(out.cantidadVendida).toBe(8);
  });

  it('estadisticas propaga error si el servicio no encuentra datos', async () => {
    const id = ProductoId.generar().getValue();
    mockProductoService.buscarEstadisticas.mockRejectedValue(
      new EntityNotFoundException('ProductoEstadisticas', id),
    );

    await expect(controller.estadisticas({ id })).rejects.toThrow(
      EntityNotFoundException,
    );
  });

  it('actualizar devuelve producto mapeado', async () => {
    const id = ProductoId.generar().getValue();
    const catId = CategoriaId.generar().getValue();
    const request = {
      nombre: 'Actual',
      descripcion: 'Nueva',
      precio: 50,
      categoriaId: catId,
    };
    const actualizado = Producto.crear(
      NombreProducto.crear(request.nombre),
      DescripcionProducto.crear(request.descripcion),
      Money.crear(request.precio),
      CategoriaId.of(catId),
    );
    mockProductoService.actualizar.mockResolvedValue(actualizado);

    const out = await controller.actualizar({ id }, request);

    expect(mockProductoService.actualizar).toHaveBeenCalled();
    expect(out.nombre).toBe('Actual');
  });

  it('masVendidos usa el límite recibido', async () => {
    mockProductoService.buscarMasVendidos.mockResolvedValue([]);
    await controller.masVendidos(7);
    expect(mockProductoService.buscarMasVendidos).toHaveBeenCalledWith(7);
  });

  it('agregarImagen invoca al servicio con datos del body', async () => {
    const id = ProductoId.generar().getValue();
    mockProductoService.agregarImagen.mockResolvedValue(undefined);

    await controller.agregarImagen(
      { id },
      { url: 'https://imgs.example/a.png', alt: 'A', orden: 1 },
    );

    expect(mockProductoService.agregarImagen).toHaveBeenCalledTimes(1);
    const [, imagen] = mockProductoService.agregarImagen.mock.calls[0];
    expect(imagen.getUrl()).toBe('https://imgs.example/a.png');
    expect(imagen.getOrden()).toBe(1);
  });

  it('actualizarCategoria propaga excepciones del servicio', async () => {
    const id = CategoriaId.generar().getValue();
    mockProductoService.actualizarCategoria.mockRejectedValue(
      new EntityNotFoundException('Categoria', id),
    );

    await expect(
      controller.actualizarCategoria(
        { id },
        { nombre: 'X', descripcion: 'Y', categoriaPadreId: undefined },
      ),
    ).rejects.toThrow(EntityNotFoundException);
  });

  it('obtenerCategoriaPorId devuelve DTO mapeado', async () => {
    const id = CategoriaId.generar().getValue();
    const cat = Categoria.crear('Libros', 'Lectura');
    mockProductoService.buscarCategoriaPorId.mockResolvedValue(cat);

    const out = await controller.obtenerCategoriaPorId({ id });

    expect(out.nombre).toBe('Libros');
    expect(out.descripcion).toBe('Lectura');
  });
});
