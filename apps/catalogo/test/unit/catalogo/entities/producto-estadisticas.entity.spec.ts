import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { DateTime } from '@app/shared/domain/value-objects/datetime.vo';
import { describe, expect, it } from 'vitest';

describe('ProductoEstadisticas (agregado)', () => {
  it('crear inicia contadores en cero', () => {
    const pid = ProductoId.generar();
    const e = ProductoEstadisticas.crear(pid);

    expect(e.getProductoId().getValue()).toBe(pid.getValue());
    expect(e.getVentasTotales()).toBe(0);
    expect(e.getCantidadVendida()).toBe(0);
    expect(e.getVecesAgregadoAlCarrito()).toBe(0);
  });

  it('incrementarVentas suma cantidad y cuenta una transaccion por llamada', () => {
    const e = ProductoEstadisticas.crear(ProductoId.generar());

    e.incrementarVentas(4);
    expect(e.getCantidadVendida()).toBe(4);
    expect(e.getVentasTotales()).toBe(1);

    e.incrementarVentas(2);
    expect(e.getCantidadVendida()).toBe(6);
    expect(e.getVentasTotales()).toBe(2);
  });

  it('incrementarAgregadoAlCarrito suma de a uno', () => {
    const e = ProductoEstadisticas.crear(ProductoId.generar());

    e.incrementarAgregadoAlCarrito();
    e.incrementarAgregadoAlCarrito();

    expect(e.getVecesAgregadoAlCarrito()).toBe(2);
  });

  it('reconstruct restaura todos los campos', () => {
    const pid = ProductoId.generar();
    const t1 = DateTime.now();
    const t2 = DateTime.now();
    const e = ProductoEstadisticas.reconstruct(
      pid,
      3,
      15,
      7,
      t1,
      t2,
    );

    expect(e.getVentasTotales()).toBe(3);
    expect(e.getCantidadVendida()).toBe(15);
    expect(e.getVecesAgregadoAlCarrito()).toBe(7);
    expect(e.getUltimaVentaAt()).toBe(t1);
    expect(e.getUltimaAgregadoAlCarritoAt()).toBe(t2);
  });
});
