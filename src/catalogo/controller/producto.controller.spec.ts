import { Test, TestingModule } from '@nestjs/testing';
import { ProductoController } from './producto.controller';
import { ProductoService } from '@catalogo/service/producto.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductoMapper } from '@catalogo/controller/mappers/producto.mapper';
import { CategoriaMapper } from '@catalogo/controller/mappers/categoria.mapper';
import { ProductoEstadisticasMapper } from '@catalogo/controller/mappers/producto-estadisticas.mapper';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';

describe('ProductoController', () => {
  let controller: ProductoController;
  let service: ProductoService;

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
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoController],
      providers: [
        {
          provide: ProductoService,
          useValue: mockProductoService,
        },
      ],
    }).compile();

    controller = module.get<ProductoController>(ProductoController);
    service = module.get<ProductoService>(ProductoService);
  });

  describe('Productos', () => {
    it('debe crear un producto', async () => {
      const request = {
        nombre: 'Producto 1',
        descripcion: 'Descripcion 1',
        precio: 100,
        categoriaId: CategoriaId.generar().getValue(),
      };
      const producto = Producto.crear(
        NombreProducto.crear(request.nombre),
        DescripcionProducto.crear(request.descripcion),
        Money.crear(request.precio),
        CategoriaId.of(request.categoriaId),
      );
      mockProductoService.crear.mockResolvedValue(producto);

      const result = await controller.crear(request);

      expect(service.crear).toHaveBeenCalled();
      expect(result.nombre).toBe(request.nombre);
    });

    it('debe obtener todos los productos', async () => {
      const productos = [
        Producto.crear(
          NombreProducto.crear('Producto 1'),
          DescripcionProducto.crear('D1'),
          Money.crear(10),
          CategoriaId.generar(),
        ),
      ];
      mockProductoService.buscarTodos.mockResolvedValue(productos);

      const result = await controller.obtenerTodos();

      expect(service.buscarTodos).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });

    it('debe obtener productos mas vendidos', async () => {
      mockProductoService.buscarMasVendidos.mockResolvedValue([]);

      const result = await controller.masVendidos(5);

      expect(service.buscarMasVendidos).toHaveBeenCalledWith(5);
      expect(result).toEqual([]);
    });

    it('debe obtener un producto por ID', async () => {
      const id = ProductoId.generar().getValue();
      const producto = Producto.crear(
        NombreProducto.crear('Producto 1'),
        DescripcionProducto.crear('D1'),
        Money.crear(10),
        CategoriaId.generar(),
      );
      mockProductoService.obtenerProducto.mockResolvedValue(producto);

      const result = await controller.obtener({ id });

      expect(service.obtenerProducto).toHaveBeenCalled();
      expect(result.nombre).toEqual({ valor: 'Producto 1' });
    });

    it('debe activar un producto', async () => {
      const id = ProductoId.generar().getValue();
      await controller.activar({ id });
      expect(service.activar).toHaveBeenCalled();
    });

    it('debe desactivar un producto', async () => {
      const id = ProductoId.generar().getValue();
      await controller.desactivar({ id });
      expect(service.desactivar).toHaveBeenCalled();
    });
  });

  describe('Categorias', () => {
    it('debe crear una categoria', async () => {
      const request = {
        nombre: 'Cat 1',
        descripcion: 'Desc Cat 1',
        categoriaPadreId: undefined,
      };
      const categoria = Categoria.crear(request.nombre, request.descripcion);
      mockProductoService.crearCategoria.mockResolvedValue(categoria);

      const result = await controller.crearCategoria(request);

      expect(service.crearCategoria).toHaveBeenCalled();
      expect(result.nombre).toBe(request.nombre);
    });

    it('debe obtener todas las categorias', async () => {
      mockProductoService.buscarTodasCategorias.mockResolvedValue([]);
      const result = await controller.obtenerTodasCategorias();
      expect(service.buscarTodasCategorias).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('debe obtener categoria por ID', async () => {
      const id = CategoriaId.generar().getValue();
      const categoria = Categoria.crear('C1', 'D1');
      mockProductoService.buscarCategoriaPorId.mockResolvedValue(categoria);

      const result = await controller.obtenerCategoriaPorId({ id });

      expect(service.buscarCategoriaPorId).toHaveBeenCalled();
      expect(result.nombre).toBe('C1');
    });
  });
});
