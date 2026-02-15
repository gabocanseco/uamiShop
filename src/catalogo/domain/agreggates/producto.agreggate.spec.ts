import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id';
import { Money } from '@shared/domain/value-objects/money.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Imagen } from '@catalogo/domain/value-objects/imagen';
import { ProductoException } from '@catalogo/domain/exceptions/producto.exception';
import { ImagenId } from '@catalogo/domain/value-objects/ids/imagen-id.vo';
import { describe, it, expect } from 'vitest';

describe('Producto Agreggate', () => {
  describe('Creación', () => {
    it('El precio debe ser mayor a cero', () => {
      const nombre = NombreProducto.crear('nombre producto');
      const descripcion = DescripcionProducto.crear('descripcion');
      const categoriaId = CategoriaId.generar();

      const precioInvalido = Money.crear(-1, 'MXN');

      expect(() => {
        Producto.crear(nombre, descripcion, precioInvalido, categoriaId);
      }).toThrow(ProductoException);
    });
  });

  describe('cambiar precio', () => {
    it('debería lanzar domainexception si el nuevo precio es negativo', () => {
      const nombre = NombreProducto.crear('prueba');
      const descripcion = DescripcionProducto.crear('descripcion');
      const precio = Money.crear(10, 'MXN');
      const categoriaid = CategoriaId.generar();
      const producto = Producto.crear(nombre, descripcion, precio, categoriaid);

      const precioInvalido = Money.crear(-1, 'MXN');

      expect(() => {
        producto.cambiarPrecio(precioInvalido);
      }).toThrow(ProductoException);
    });

    it('debería lanzar domainexception si el nuevo precio incrementa más del 50% en un solo cambio', () => {
      const id = ProductoId.generar();
      const nombre = NombreProducto.crear('prueba');
      const descripcion = DescripcionProducto.crear('descripcion');
      const precio = Money.crear(50, 'MXN');
      const categoriaid = CategoriaId.generar();
      const producto = Producto.crear(nombre, descripcion, precio, categoriaid);

      // Precio con incremento arriba del 50%
      const precioInvalido = Money.crear(80, 'MXN');

      expect(() => {
        producto.cambiarPrecio(precioInvalido);
      }).toThrow(ProductoException);
    });
  });

  describe('agregar imagen', () => {
    it('debería lanzar ProductoException si intenta agregar más de 5 imagenes', () => {
      const nombre = NombreProducto.crear('prueba');
      const descripcion = DescripcionProducto.crear('descripcion');
      const precio = Money.crear(10, 'mxn');
      const categoriaid = CategoriaId.generar();
      const producto = Producto.crear(nombre, descripcion, precio, categoriaid);

      const urls = [
        'https://img1.png',
        'https://img2.png',
        'https://img3.png',
        'https://img4.png',
        'https://img5.png',
        'https://img6.png',
      ];

      expect(() => {
        for (let i = 0; i < urls.length; i++) {
          producto.agregarImagen(
            Imagen.crear(ImagenId.generar(), urls[i], `alt${i + 1}`, i + 1),
          );
        }
      }).toThrow(ProductoException);
    });

    it('debería lanzar domainexception si la URL de la imagen no es válida', () => {
      const nombre = NombreProducto.crear('prueba');
      const descripcion = DescripcionProducto.crear('descripcion');
      const precio = Money.crear(50, 'mxn');
      const categoriaid = CategoriaId.generar();
      const producto = Producto.crear(nombre, descripcion, precio, categoriaid);

      const urlInvalida = 'img1.png';
      const imagenInvalida = Imagen.crear(
        ImagenId.generar(),
        urlInvalida,
        'alt1',
        1,
      );

      expect(() => {
        producto.agregarImagen(imagenInvalida);
      }).toThrow(ProductoException);
    });
  });

  describe('activar', () => {
    it('debería lanzar ProductoException si intenta activar un producto sin al menos una imagen', () => {
      const nombre = NombreProducto.crear('prueba');
      const descripcion = DescripcionProducto.crear('descripcion');
      const precio = Money.crear(10, 'MXN');
      const categoriaid = CategoriaId.generar();
      const productoInvalido = Producto.crear(
        nombre,
        descripcion,
        precio,
        categoriaid,
      );

      expect(() => {
        productoInvalido.activar();
      }).toThrow(ProductoException);
    });
  });

  describe('desactivar', () => {
    it('debería lanzar ProductoException si intenta desactivar un producto desactivado previamente', () => {
      const nombre = NombreProducto.crear('prueba');
      const descripcion = DescripcionProducto.crear('descripcion');
      const precio = Money.crear(10, 'MXN');
      const categoriaid = CategoriaId.generar();
      const productoDesactivado = Producto.crear(
        nombre,
        descripcion,
        precio,
        categoriaid,
      );

      expect(() => {
        productoDesactivado.desactivar();
      }).toThrow(ProductoException);
    });
  });
});
