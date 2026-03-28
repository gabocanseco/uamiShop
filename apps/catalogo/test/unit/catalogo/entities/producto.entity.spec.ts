import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Money } from '@app/shared/domain/value-objects/money.vo';
import { Imagen } from '@catalogo/domain/value-objects/imagen';
import { ImagenId } from '@catalogo/domain/value-objects/ids/imagen-id.vo';
import { BusinessRuleException } from '@app/shared/domain/exceptions/business-rule.exception';
import { describe, expect, it } from 'vitest';

function productoBase() {
  return Producto.crear(
    NombreProducto.crear('Producto base'),
    DescripcionProducto.crear('Descripcion'),
    Money.crear(100, 'MXN'),
    CategoriaId.generar(),
  );
}

describe('Producto (agregado) — casos adicionales', () => {
  it('actualizarInformacion cambia nombre y descripcion sin tocar precio', () => {
    const p = productoBase();
    const precioAntes = p.getPrecio().getCantidad();

    p.actualizarInformacion(
      NombreProducto.crear('Otro nombre'),
      DescripcionProducto.crear('Otra desc'),
    );

    expect(p.getNombre().getValue()).toBe('Otro nombre');
    expect(p.getDescripcion().getValue()).toBe('Otra desc');
    expect(p.getPrecio().getCantidad()).toBe(precioAntes);
  });

  it('cambiarPrecio permite incremento hasta el 50% inclusive', () => {
    const p = productoBase();
    p.cambiarPrecio(Money.crear(150, 'MXN'));
    expect(p.getPrecio().getCantidad()).toBe(150);
  });

  it('cambiarPrecio rechaza incremento mayor al 50%', () => {
    const p = productoBase();
    expect(() => p.cambiarPrecio(Money.crear(150.01, 'MXN'))).toThrow(
      BusinessRuleException,
    );
  });

  it('activar tiene exito con al menos una imagen y precio positivo', () => {
    const p = productoBase();
    p.agregarImagen(
      Imagen.crear(
        ImagenId.generar(),
        'https://cdn.example.com/p.jpg',
        'Producto',
        1,
      ),
    );

    p.activar();

    expect(p.toPrimitives().disponible).toBe(true);
  });

  it('cambiarPrecio permite fuertes reducciones (solo limita incrementos >50%)', () => {
    const p = productoBase();
    p.cambiarPrecio(Money.crear(20, 'MXN'));
    expect(p.getPrecio().getCantidad()).toBe(20);
  });

  it('removerImagen elimina por id', () => {
    const p = productoBase();
    const imgId = ImagenId.generar();
    p.agregarImagen(
      Imagen.crear(imgId, 'https://b.com/x.png', 'x', 1),
    );

    p.removerImagen(imgId);

    expect(p.toPrimitives().imagenes).toHaveLength(0);
  });

  it('toPrimitives incluye estructura de precio e imagenes', () => {
    const p = productoBase();
    const primitives = p.toPrimitives();
    expect(primitives.precio).toMatchObject({
      cantidad: 100,
      moneda: 'MXN',
    });
    expect(Array.isArray(primitives.imagenes)).toBe(true);
  });
});
