import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from '@catalogo/service/producto.service';
import { ProductoInMemoryRepository } from '@catalogo/repository/producto-in-memory.repository';
import { CategoriaInMemoryRepository } from '@catalogo/repository/categoria-in-memory.repository';
import { ProductoEstadisticasInMemoryRepository } from '@catalogo/repository/producto-estadisticas-in-memory-repository';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Money } from '@app/shared/domain/value-objects/money.vo';
import { Imagen } from '@catalogo/domain/value-objects/imagen';
import { ImagenId } from '@catalogo/domain/value-objects/ids/imagen-id.vo';
import { DateTime } from '@app/shared/domain/value-objects/datetime.vo';
import { EntityNotFoundException } from '@app/shared/domain/exceptions/entity-not-found.exception';
import { BusinessRuleException } from '@app/shared/domain/exceptions/business-rule.exception';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';

function crearProductoEjemplo(categoriaId: CategoriaId) {
  return Producto.crear(
    NombreProducto.crear('Item prod'),
    DescripcionProducto.crear('Detalle'),
    Money.crear(99, 'MXN'),
    categoriaId,
  );
}

describe('ProductoService (unitario)', () => {
  let service: ProductoService;
  let productoRepo: ProductoInMemoryRepository;
  let categoriaRepo: CategoriaInMemoryRepository;
  let estadisticasRepo: ProductoEstadisticasInMemoryRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext();
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [],
    });
    await dataSource.initialize();
    addTransactionalDataSource(dataSource);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

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

    service = module.get(ProductoService);
    productoRepo = module.get('IProductoRepository');
    categoriaRepo = module.get('ICategoriaRepository');
    estadisticasRepo = module.get('IProductoEstadisticasRepository');
  });

  async function guardarCategoriaBase(): Promise<Categoria> {
    const c = Categoria.crear('Electrónica', 'Varios');
    await categoriaRepo.save(c);
    return c;
  }

  it('crear lanza EntityNotFoundException si la categoría no existe', async () => {
    const producto = crearProductoEjemplo(CategoriaId.generar());

    await expect(service.crear(producto)).rejects.toThrow(
      EntityNotFoundException,
    );
    expect(await productoRepo.findAll()).toHaveLength(0);
  });

  it('crear persiste el producto cuando la categoría existe', async () => {
    const cat = await guardarCategoriaBase();
    const producto = crearProductoEjemplo(cat.getId());

    const guardado = await service.crear(producto);

    expect(guardado.getId().getValue()).toBe(producto.getId().getValue());
    expect((await productoRepo.findAll()).length).toBe(1);
  });

  it('buscarTodos devuelve la lista del repositorio', async () => {
    const cat = await guardarCategoriaBase();
    await service.crear(crearProductoEjemplo(cat.getId()));
    await service.crear(
      Producto.crear(
        NombreProducto.crear('Otro item'),
        DescripcionProducto.crear('desc'),
        Money.crear(10),
        cat.getId(),
      ),
    );

    const todos = await service.buscarTodos();
    expect(todos).toHaveLength(2);
  });

  it('buscarEstadisticas lanza EntityNotFoundException si no hay registro', async () => {
    await expect(
      service.buscarEstadisticas(ProductoId.generar()),
    ).rejects.toThrow(EntityNotFoundException);
  });

  it('buscarEstadisticas retorna el agregado cuando existe', async () => {
    const pid = ProductoId.generar();
    const stats = ProductoEstadisticas.crear(pid);
    await estadisticasRepo.save(stats);

    const result = await service.buscarEstadisticas(pid);
    expect(result.getProductoId().getValue()).toBe(pid.getValue());
  });

  it('buscarMasVendidos ordena por ventasTotales y respeta el límite', async () => {
    const idAlta = ProductoId.generar();
    const idBaja = ProductoId.generar();
    const ahora = DateTime.now();
    await estadisticasRepo.save(
      ProductoEstadisticas.reconstruct(idBaja, 1, 50, 0, ahora, ahora),
    );
    await estadisticasRepo.save(
      ProductoEstadisticas.reconstruct(idAlta, 5, 20, 0, ahora, ahora),
    );

    const mas = await service.buscarMasVendidos(1);
    expect(mas).toHaveLength(1);
    expect(mas[0].getProductoId().getValue()).toBe(idAlta.getValue());
  });

  it('agregarImagen propaga reglas de dominio (URL inválida)', async () => {
    const cat = await guardarCategoriaBase();
    await service.crear(crearProductoEjemplo(cat.getId()));
    const [p] = await productoRepo.findAll();
    const img = Imagen.crear(ImagenId.generar(), 'sin-protocolo.png', 'x', 1);

    await expect(service.agregarImagen(p.getId(), img)).rejects.toThrow(
      BusinessRuleException,
    );
  });

  it('activar falla de dominio si el producto no tiene imágenes', async () => {
    const cat = await guardarCategoriaBase();
    await service.crear(crearProductoEjemplo(cat.getId()));
    const [p] = await productoRepo.findAll();

    await expect(service.activar(p.getId())).rejects.toThrow(
      BusinessRuleException,
    );
  });

  it('actualizarCategoria asigna padre cuando viene en el request', async () => {
    const padre = Categoria.crear('Padre', 'P');
    const hija = Categoria.crear('Hija', 'H');
    await categoriaRepo.save(padre);
    await categoriaRepo.save(hija);

    const payload = Categoria.crear('Hija', 'H', padre.getId());
    const actualizada = await service.actualizarCategoria(hija.getId(), payload);

    expect(actualizada.getCategoriaPadreId()?.getValue()).toBe(
      padre.getId().getValue(),
    );
  });

  it('buscarCategoriaPorId lanza EntityNotFoundException si no existe', async () => {
    await expect(
      service.buscarCategoriaPorId(CategoriaId.generar()),
    ).rejects.toThrow(EntityNotFoundException);
  });

  it('desactivar propaga error si el producto ya estaba no disponible', async () => {
    const cat = await guardarCategoriaBase();
    await service.crear(crearProductoEjemplo(cat.getId()));
    const [p] = await productoRepo.findAll();

    await expect(service.desactivar(p.getId())).rejects.toThrow(
      BusinessRuleException,
    );
  });

  it('actualizar lanza EntityNotFoundException si el producto no existe', async () => {
    const cat = await guardarCategoriaBase();
    const nuevo = crearProductoEjemplo(cat.getId());

    await expect(
      service.actualizar(ProductoId.generar(), nuevo),
    ).rejects.toThrow(EntityNotFoundException);
  });
});
