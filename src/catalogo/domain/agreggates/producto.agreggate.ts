import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { ImagenId } from '@catalogo/domain/value-objects/ids/imagen-id.vo';
import { Imagen } from '@catalogo/domain/value-objects/imagen';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { Disponible } from '@catalogo/domain/value-objects/disponible.vo';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';

export class Producto {
  private constructor(
    private readonly id: ProductoId,
    private nombre: NombreProducto,
    private descripcion: DescripcionProducto,
    private precio: Money,
    private categoriaId: CategoriaId,
    private imagenes: Imagen[],
    private disponible: Disponible,
    private fechaCreacion: DateTime,
  ) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.categoriaId = categoriaId;
    this.imagenes = imagenes;
    this.disponible = disponible;
    this.fechaCreacion = fechaCreacion;
  }

  public static crear(
    nombre: NombreProducto,
    descripcion: DescripcionProducto,
    precio: Money,
    categoriaId: CategoriaId,
  ) {
    if (!precio.isPositive()) {
      throw new BusinessRuleException(`El precio debe ser mayor a cero.`);
    }

    return new Producto(
      ProductoId.generar(),
      nombre,
      descripcion,
      precio,
      categoriaId,
      [],
      Disponible.creaNoDisponible(),
      DateTime.now(),
    );
  }

  public actualizarInformacion(
    nombre: NombreProducto,
    descripcion: DescripcionProducto,
  ): void {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }

  public cambiarPrecio(nuevoPrecio: Money): void {
    if (nuevoPrecio.isNegative()) {
      throw new BusinessRuleException(`El nuevo precio no puede ser negativo`);
    }

    const porcentaje = 50; // El precio no puede incrementar más del 50%
    const factor = porcentaje / 100;
    const precioConPorcentaje = this.precio.multiplicar(factor);
    if (nuevoPrecio.greaterThan(this.precio.sumar(precioConPorcentaje))) {
      throw new BusinessRuleException(
        `El precio no puede incrementar más del ${porcentaje}% en un solo cambio`,
      );
    }

    this.precio = nuevoPrecio;
  }

  public activar(): void {
    // validar
    if (this.imagenes.length < 1) {
      throw new BusinessRuleException(
        `Un producto solo puede activarse si tiene al menos una imagen`,
      );
    }

    if (!this.precio.isPositive()) {
      throw new BusinessRuleException(
        `Un producto solo puede activarse si tiene precio mayor a cero`,
      );
    }

    this.disponible = Disponible.creaDisponible();
  }

  public desactivar(): void {
    if (!this.disponible.estaDisponible()) {
      throw new BusinessRuleException(
        `El producto ya está desactivado, no puede desactivarse nuevamente.`,
      );
    }

    this.disponible = Disponible.creaNoDisponible();
  }

  public agregarImagen(imagen: Imagen): void {
    const limiteImagenes = 5;
    if (this.imagenes.length >= limiteImagenes) {
      throw new BusinessRuleException(
        `No se pueden agregar más imagenes porque el limte ${limiteImagenes} se ha alcanzado.`,
      );
    }

    const regexUrl = /^https?:\/\//;
    if (!regexUrl.test(imagen.getUrl())) {
      throw new BusinessRuleException(`La URL de la imagen no es válida.`);
    }

    this.imagenes.push(imagen);
  }

  public removerImagen(imagenId: ImagenId): void {
    // Solo se quedan las imagenes que no son iguales al id recibido
    this.imagenes = this.imagenes.filter(
      (imagen) => !imagen.getId().equals(imagenId),
    );
  }

  public getId(): ProductoId {
    return this.id;
  }

  public getNombre(): NombreProducto {
    return this.nombre;
  }

  public getDescripcion(): DescripcionProducto {
    return this.descripcion;
  }

  public getPrecio(): Money {
    return this.precio;
  }

  public toPrimitives() {
    return {
      id: this.id.getValue(),
      nombre: this.nombre.getValue(),
      descripcion: this.descripcion.getValue(),
      precio: this.precio.getCantidad(),
      moneda: this.precio.codigoMoneda,
      categoriaId: this.categoriaId.getValue(),
      disponible: this.disponible.estaDisponible(),
      fechaCreacion: this.fechaCreacion.getValue(),
      imagenes: this.imagenes.map((img) => ({
        id: img.getId().getValue(),
        url: img.getUrl(),
        alt: img.getAltText(),
        orden: img.getOrden(),
      })),
    };
  }
}
