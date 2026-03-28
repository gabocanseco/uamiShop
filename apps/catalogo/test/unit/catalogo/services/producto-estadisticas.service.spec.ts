import { Test, TestingModule } from '@nestjs/testing';
import { ProductoEstadisticasService } from '@catalogo/service/producto-estadisticas.service';
import { ProductoEstadisticasInMemoryRepository } from '@catalogo/repository/producto-estadisticas-in-memory-repository';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { EntityNotFoundException } from '@app/shared/domain/exceptions/entity-not-found.exception';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ProductoEstadisticasService (unitario)', () => {
  let service: ProductoEstadisticasService;
  let repo: ProductoEstadisticasInMemoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductoEstadisticasService,
        {
          provide: 'IProductoEstadisticasRepository',
          useClass: ProductoEstadisticasInMemoryRepository,
        },
      ],
    }).compile();

    service = module.get(ProductoEstadisticasService);
    repo = module.get('IProductoEstadisticasRepository');
  });

  it('registrarVenta crea estadísticas si no existían y acumula ventas', async () => {
    const pid = ProductoId.generar();

    const primera = await service.registrarVenta(pid, 3);
    expect(primera.getCantidadVendida()).toBe(3);
    expect(primera.getVentasTotales()).toBe(1);

    const segunda = await service.registrarVenta(pid, 2);
    expect(segunda.getCantidadVendida()).toBe(5);
    expect(segunda.getVentasTotales()).toBe(2);

    const stored = await repo.findByProductoId(pid);
    expect(stored?.getCantidadVendida()).toBe(5);
  });

  it('registrarAgregadoAlCarrito crea o incrementa vecesAgregadoAlCarrito', async () => {
    const pid = ProductoId.generar();

    const a = await service.registrarAgregadoAlCarrito(pid);
    expect(a.getVecesAgregadoAlCarrito()).toBe(1);

    const b = await service.registrarAgregadoAlCarrito(pid);
    expect(b.getVecesAgregadoAlCarrito()).toBe(2);
  });

  it('obtenerEstadisticas lanza EntityNotFoundException si no hay fila', async () => {
    await expect(
      service.obtenerEstadisticas(ProductoId.generar()),
    ).rejects.toThrow(EntityNotFoundException);
  });

  it('obtenerEstadisticas devuelve el agregado persistido', async () => {
    const pid = ProductoId.generar();
    await service.registrarVenta(pid, 1);

    const stats = await service.obtenerEstadisticas(pid);
    expect(stats.getProductoId().getValue()).toBe(pid.getValue());
    expect(stats.getCantidadVendida()).toBe(1);
  });

  it('obtenerMasVendidos delega al repositorio', async () => {
    const spy = vi.spyOn(repo, 'findMasVendidos');
    spy.mockResolvedValue([]);

    const res = await service.obtenerMasVendidos(3);

    expect(spy).toHaveBeenCalledWith(3);
    expect(res).toEqual([]);
  });
});
