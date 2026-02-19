import { Injectable, Inject } from '@nestjs/common';
import type { ICarritoRepository } from '@ventas/repository/interfaces/carrito.repository';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { CarritoResponseDto } from '@ventas/controller/dtos/carrito-response.dto';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { Carrito } from '@ventas/domain/agreggates/carrito';
import { VentaException } from '@ventas/domain/exceptions/venta.exception';

/**
 * Servicio de aplicación para gestionar carritos de compra
 */
@Injectable()
export class CarritoService {
  constructor(
    @Inject('ICarritoRepository')
    private readonly carritoRepository: ICarritoRepository,
  ) {}

  /**
   * Crea un carrito vacío asociado a un cliente
   */
  async crear(clienteId: ClienteId): Promise<CarritoResponseDto> {
    const nuevoCarrito = Carrito.crear(clienteId);
    await this.carritoRepository.save(nuevoCarrito);

    return CarritoResponseDto.fromDomain(nuevoCarrito);
  }

  /**
   * Obtiene un carrito por su ID
   */
  async obtenerCarrito(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);
    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Agrega un producto al carrito
   */
  async agregarProducto(
    carritoId: CarritoId,
    productoRef: ProductoRef,
    cantidad: number,
    precioUnitario: Money,
  ): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.agregarProducto(productoRef, cantidad, precioUnitario);

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Modifica la cantidad de un producto en el carrito
   */
  async modificarCantidad(
    carritoId: CarritoId,
    productoId: ProductoId,
    nuevaCantidad: number,
  ): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.modificarCantidad(productoId, nuevaCantidad);

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Elimina un producto del carrito
   */
  async eliminarProducto(
    carritoId: CarritoId,
    productoId: ProductoId,
  ): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.eliminarProducto(productoId);

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Vacía el carrito eliminando todos los productos
   */
  async vaciar(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.vaciar();

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Inicia el proceso de checkout del carrito
   */
  async iniciarCheckout(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.iniciarCheckout();

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Completa el checkout del carrito
   */
  async completarCheckout(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.completarCheckout();

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Marca el carrito como abandonado
   */
  async abandonar(carritoId: CarritoId): Promise<CarritoResponseDto> {
    const carrito = await this.obtenerCarritoPorId(carritoId);

    carrito.abandonar();

    await this.carritoRepository.update(carrito);

    return CarritoResponseDto.fromDomain(carrito);
  }

  /**
   * Método privado para obtener un carrito y lanzar excepción si no existe
   */
  private async obtenerCarritoPorId(id: CarritoId): Promise<Carrito> {
    const carrito = await this.carritoRepository.findById(id);
    if (!carrito) {
      throw new VentaException(
        `Carrito con ID ${id.getValue()} no encontrado`,
      );
    }
    return carrito;
  }

  // TODO: Inyectar repositorios cuando estén disponibles
  // constructor(
  //   @Inject('ProductoRepository') private readonly productoRepository: ProductoRepository,
  //   @Inject('CategoriaRepository') private readonly categoriaRepository: CategoriaRepository
  // ) {}
  // // Almacenamiento temporal en memoria (remover cuando se implemente el repositorio)
  // private productos: Map<string, Producto> = new Map();
  // private categorias: Map<string, Categoria> = new Map();
  // /**
  //  * Crea un nuevo producto a partir del request
  //  * Valida y asigna categoría por ID
  //  */
  // async crear(request: ProductoRequest): Promise<ProductoResponse> {
  //   // Validar que la categoría existe
  //   const categoriaId = CategoriaId.of(request.categoriaId);
  //   const categoriaExiste = this.categorias.has(request.categoriaId);
  //   if (!categoriaExiste) {
  //     throw new NotFoundException(
  //       `Categoría con ID ${request.categoriaId} no encontrada`,
  //     );
  //   }
  //   // Crear el producto
  //   const productoId = ProductoId.generar();
  //   const nombre = new NombreProducto(request.nombre);
  //   const descripcion = new DescripcionProducto(request.descripcion);
  //   const precio = Money.crear(request.precio, request.moneda || 'MXN');
  //   const disponible = new Disponible(false); // Por defecto inactivo
  //   const fechaCreacion = DateTime.now();
  //   const producto = Producto.crear(
  //     productoId,
  //     nombre,
  //     descripcion,
  //     precio,
  //     categoriaId,
  //     [], // Sin imágenes inicialmente
  //     disponible,
  //     fechaCreacion,
  //   );
  //   // Persistir
  //   this.productos.set(productoId.getValue(), producto);
  //   // TODO: await this.productoRepository.guardar(producto);
  //   return this.toProductoResponse(producto);
  // }
  // /**
  //  * Busca un producto por ID
  //  * Lanza excepción si no existe
  //  */
  // async buscarPorId(id: string): Promise<ProductoResponse> {
  //   const producto = this.productos.get(id);
  //   // TODO: const producto = await this.productoRepository.buscarPorId(ProductoId.of(id));
  //   if (!producto) {
  //     throw new NotFoundException(`Producto con ID ${id} no encontrado`);
  //   }
  //   return this.toProductoResponse(producto);
  // }
  // /**
  //  * Obtiene todos los productos persistidos
  //  */
  // async buscarTodos(): Promise<ProductoResponse[]> {
  //   const productos = Array.from(this.productos.values());
  //   // TODO: const productos = await this.productoRepository.buscarTodos();
  //   return productos.map((producto) => this.toProductoResponse(producto));
  // }
  // /**
  //  * Actualiza nombre y descripción del producto
  //  * Si viene precio, lo cambia también
  //  */
  // async actualizar(
  //   id: string,
  //   request: ProductoRequest,
  // ): Promise<ProductoResponse> {
  //   const producto = this.productos.get(id);
  //   // TODO: const producto = await this.productoRepository.buscarPorId(ProductoId.of(id));
  //   if (!producto) {
  //     throw new NotFoundException(`Producto con ID ${id} no encontrado`);
  //   }
  //   // Actualizar información básica
  //   const nombre = new NombreProducto(request.nombre);
  //   const descripcion = new DescripcionProducto(request.descripcion);
  //   producto.actualizarInformacion(nombre, descripcion);
  //   // Si viene precio, actualizarlo
  //   if (request.precio !== undefined) {
  //     const nuevoPrecio = Money.crear(request.precio, request.moneda || 'MXN');
  //     producto.cambiarPrecio(nuevoPrecio);
  //   }
  //   // Persistir
  //   this.productos.set(id, producto);
  //   // TODO: await this.productoRepository.actualizar(producto);
  //   return this.toProductoResponse(producto);
  // }
  // /**
  //  * Activa un producto
  //  * Valida que tenga al menos una imagen y precio > 0
  //  */
  // async activar(id: string): Promise<void> {
  //   const producto = this.productos.get(id);
  //   // TODO: const producto = await this.productoRepository.buscarPorId(ProductoId.of(id));
  //   if (!producto) {
  //     throw new NotFoundException(`Producto con ID ${id} no encontrado`);
  //   }
  //   // El método activar() del agregado valida las reglas de negocio
  //   producto.activar();
  //   // Persistir
  //   this.productos.set(id, producto);
  //   // TODO: await this.productoRepository.actualizar(producto);
  // }
  // /**
  //  * Desactiva un producto
  //  */
  // async desactivar(id: string): Promise<void> {
  //   const producto = this.productos.get(id);
  //   // TODO: const producto = await this.productoRepository.buscarPorId(ProductoId.of(id));
  //   if (!producto) {
  //     throw new NotFoundException(`Producto con ID ${id} no encontrado`);
  //   }
  //   // El método desactivar() del agregado valida las reglas de negocio
  //   producto.desactivar();
  //   // Persistir
  //   this.productos.set(id, producto);
  //   // TODO: await this.productoRepository.actualizar(producto);
  // }
  // /**
  //  * Crea una categoría con ID generado
  //  * Opcionalmente asigna categoría padre
  //  */
  // async crearCategoria(request: CategoriaRequest): Promise<CategoriaResponse> {
  //   const categoriaId = CategoriaId.generar();
  //   const nombre = new NombreProducto(request.nombre);
  //   const descripcion = new DescripcionProducto(request.descripcion);
  //   // Si viene categoría padre, validar que existe
  //   let categoriaPadreId: CategoriaId | undefined;
  //   if (request.categoriaPadreId) {
  //     const padreExiste = this.categorias.has(request.categoriaPadreId);
  //     // TODO: const padreExiste = await this.categoriaRepository.existe(CategoriaId.of(request.categoriaPadreId));
  //     if (!padreExiste) {
  //       throw new NotFoundException(
  //         `Categoría padre con ID ${request.categoriaPadreId} no encontrada`,
  //       );
  //     }
  //     categoriaPadreId = CategoriaId.of(request.categoriaPadreId);
  //   }
  //   const categoria = new Categoria(
  //     categoriaId,
  //     nombre,
  //     descripcion,
  //     categoriaPadreId,
  //   );
  //   // Persistir
  //   this.categorias.set(categoriaId.getValue(), categoria);
  //   // TODO: await this.categoriaRepository.guardar(categoria);
  //   return this.toCategoriaResponse(categoria);
  // }
  // /**
  //  * Busca una categoría por ID
  //  * Lanza excepción si no existe
  //  */
  // async buscarCategoriaPorId(id: string): Promise<CategoriaResponse> {
  //   const categoria = this.categorias.get(id);
  //   // TODO: const categoria = await this.categoriaRepository.buscarPorId(CategoriaId.of(id));
  //   if (!categoria) {
  //     throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
  //   }
  //   return this.toCategoriaResponse(categoria);
  // }
  // /**
  //  * Obtiene todas las categorías
  //  */
  // async buscarTodasCategorias(): Promise<CategoriaResponse[]> {
  //   const categorias = Array.from(this.categorias.values());
  //   // TODO: const categorias = await this.categoriaRepository.buscarTodas();
  //   return categorias.map((categoria) => this.toCategoriaResponse(categoria));
  // }
  // /**
  //  * Actualiza nombre y descripción de la categoría
  //  * Si viene categoriaPadreId, asigna el padre
  //  */
  // async actualizarCategoria(
  //   id: string,
  //   request: CategoriaRequest,
  // ): Promise<CategoriaResponse> {
  //   const categoria = this.categorias.get(id);
  //   // TODO: const categoria = await this.categoriaRepository.buscarPorId(CategoriaId.of(id));
  //   if (!categoria) {
  //     throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
  //   }
  //   // Actualizar información básica
  //   const nombre = new NombreProducto(request.nombre);
  //   const descripcion = new DescripcionProducto(request.descripcion);
  //   categoria.actualizar(nombre, descripcion);
  //   // Si viene categoría padre, asignarla
  //   if (request.categoriaPadreId) {
  //     const padreExiste = this.categorias.has(request.categoriaPadreId);
  //     // TODO: const padreExiste = await this.categoriaRepository.existe(CategoriaId.of(request.categoriaPadreId));
  //     if (!padreExiste) {
  //       throw new NotFoundException(
  //         `Categoría padre con ID ${request.categoriaPadreId} no encontrada`,
  //       );
  //     }
  //     const categoriaPadreId = CategoriaId.of(request.categoriaPadreId);
  //     categoria.asignarPadre(categoriaPadreId);
  //   }
  //   // Persistir
  //   this.categorias.set(id, categoria);
  //   // TODO: await this.categoriaRepository.actualizar(categoria);
  //   return this.toCategoriaResponse(categoria);
  // }
  // /**
  //  * Convierte un Producto a ProductoResponse
  //  */
  // private toProductoResponse(producto: any): ProductoResponse {
  //   return {
  //     id: producto.id?.getValue() || producto.id,
  //     nombre: producto.nombre?.valor || producto.nombre,
  //     descripcion: producto.descripcion?.valor || producto.descripcion,
  //     precio: {
  //       cantidad: producto.precio?.cantidadDecimal || 0,
  //       moneda: producto.precio?.codigoMoneda || 'MXN',
  //     },
  //     categoriaId: producto.categoriaId?.getValue() || producto.categoriaId,
  //     disponible: producto.disponible?.estaDisponible() || false,
  //     fechaCreacion:
  //       producto.fechaCreacion?.toISOString() || new Date().toISOString(),
  //   };
  // }
  // /**
  //  * Convierte una Categoria a CategoriaResponse
  //  */
  // private toCategoriaResponse(categoria: any): CategoriaResponse {
  //   return {
  //     id: categoria.id?.getValue() || categoria.id,
  //     nombre: categoria.nombre?.valor || categoria.nombre,
  //     descripcion: categoria.descripcion?.valor || categoria.descripcion,
  //     categoriaPadreId: categoria.categoriaPadreId?.getValue(),
  //   };
  // }
}
