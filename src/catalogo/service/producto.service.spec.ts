import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProductoInMemoryRepository } from '@catalogo/repository/producto-in-memory.repository';
import { CategoriaInMemoryRepository } from '@catalogo/repository/categoria-in-memory.repository';
import { ProductoEstadisticasInMemoryRepository } from '@catalogo/repository/producto-estadisticas-in-memory-repository';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';

describe('ProductoService', () => {
  let service: ProductoService;
  let productoRepo: ProductoInMemoryRepository;
  let categoriaRepo: CategoriaInMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoService,
        {
          provide: 'IProductoRepository',
          useClass: ProductoInMemoryRepository,
        },
        {
          provide: 'ICategoriaRepository',
          useClass: CategoriaInMemoryRepository,
        },
        {
          provide: 'IProductoEstadisticasRepository',
          useClass: ProductoEstadisticasInMemoryRepository,
        },
      ],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    productoRepo = module.get<ProductoInMemoryRepository>(
      'IProductoRepository',
    );
    categoriaRepo = module.get<CategoriaInMemoryRepository>(
      'ICategoriaRepository',
    );
  });

  describe('Producto', () => {
    it('debe crear un producto', async () => {
      const categoria = Categoria.crear('Electronica', 'Gadgets y mas');
      categoriaRepo.save(categoria);

      const producto = Producto.crear(
        NombreProducto.crear('Laptop'),
        DescripcionProducto.crear('Una laptop potente'),
        Money.crear(1200),
        categoria.getId(),
      );

      const guardado = await service.crear(producto);

      expect(guardado).toBeDefined();
      expect(guardado.getId()).toBe(producto.getId());
    });

    it('debe buscar un producto por ID', async () => {
      const categoria = Categoria.crear('Electronica', 'Gadgets y mas');
      categoriaRepo.save(categoria);

      const producto = Producto.crear(
        NombreProducto.crear('Teclado'),
        DescripcionProducto.crear('Mecanico'),
        Money.crear(100),
        categoria.getId(),
      );
      await service.crear(producto);

      const encontrado = await service.buscarPorId(producto.getId());
      expect(encontrado.getNombre().getValue()).toBe('Teclado');
    });

    it('debe lanzar EntityNotFoundException si el producto no existe', async () => {
      await expect(service.buscarPorId(ProductoId.generar())).rejects.toThrow(
        EntityNotFoundException,
      );
    });

    it('debe actualizar un producto', async () => {
      const categoria = Categoria.crear('Electronica', 'Gadgets y mas');
      categoriaRepo.save(categoria);

      const producto = Producto.crear(
        NombreProducto.crear('Mouse'),
        DescripcionProducto.crear('Gamer'),
        Money.crear(50),
        categoria.getId(),
      );
      await service.crear(producto);

      const nuevoProducto = Producto.crear(
        NombreProducto.crear('Mouse Pro'),
        DescripcionProducto.crear('Gamer Pro'),
        Money.crear(60),
        categoria.getId(),
      );

      const actualizado = await service.actualizar(
        producto.getId(),
        nuevoProducto,
      );
      expect(actualizado.getNombre().getValue()).toBe('Mouse Pro');
      expect(actualizado.getPrecio().getCantidad()).toBe(60);
    });
  });

  describe('Categoria', () => {
    it('debe crear una categoria', async () => {
      const categoria = Categoria.crear('Electronica', 'Gadgets y mas');
      const guardada = await service.crearCategoria(categoria);

      expect(guardada).toBeDefined();
      expect(guardada.getNombre()).toBe('Electronica');
    });

    it('debe buscar categoria por ID', async () => {
      const categoria = Categoria.crear('Libros', 'Lectura');
      await service.crearCategoria(categoria);

      const encontrada = await service.buscarCategoriaPorId(categoria.getId());
      expect(encontrada.getNombre()).toBe('Libros');
    });

    it('debe actualizar una categoria', async () => {
      const categoria = Categoria.crear('Ropa', 'Moda');
      await service.crearCategoria(categoria);

      const nuevaData = Categoria.crear('Ropa de Invierno', 'Moda invernal');
      const actualizada = await service.actualizarCategoria(
        categoria.getId(),
        nuevaData,
      );
      expect(actualizada.getNombre()).toBe('Ropa de Invierno');
    });
  });
});
