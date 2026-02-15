import { CategoriaRequestDto } from '@catalogo/controller/dtos/categoria-request.dto';
import { CategoriaResponseDto } from '@catalogo/controller/dtos/categoria-response.dto';
import { ProductoRequestDto } from '@catalogo/controller/dtos/producto-request.dto';
import { ProductoResponseDto } from '@catalogo/controller/dtos/producto-response.dto';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoException } from '@catalogo/domain/exceptions/producto.exception';
import { DescripcionProducto } from '@catalogo/domain/value-objects/descripcion-producto.vo';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import type { ICategoriaRepository } from '@catalogo/repository/interfaces/categoria.repository';
import type { IProductoRepository } from '@catalogo/repository/interfaces/producto.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id';
import { Money } from '@shared/domain/value-objects/money.vo';

@Injectable() // Convierte esta clase en un proveedor de servicios que puede ser inyectado en otros componentes de NestJS
export class ProductoService {
  constructor(
    @Inject('IProductoRepository')
    private readonly productoRepository: IProductoRepository,
    @Inject('ICategoriaRepository')
    private readonly categoriaRepository: ICategoriaRepository,
  ) {}

  async crear(request: ProductoRequestDto): Promise<ProductoResponseDto> {
    const nombre = NombreProducto.crear(request.nombre);
    const descripcion = DescripcionProducto.crear(request.descripcion);
    const precio = Money.crear(request.precio);

    const categoria = await this.categoriaRepository.findByNombre(
      request.categoria,
    );
    if (!categoria) {
      throw new ProductoException(
        `La categoría ${request.categoria} no existe.`,
      );
    }

    const nuevoProducto = Producto.crear(
      nombre,
      descripcion,
      precio,
      categoria.getId(),
    );
    await this.productoRepository.save(nuevoProducto);
    return ProductoResponseDto.fromDomain(nuevoProducto);
  }

  async buscarPorId(id: ProductoId): Promise<ProductoResponseDto> {
    const producto = await this.obtenerProductoPorId(id);

    return ProductoResponseDto.fromDomain(producto);
  }

  async buscarTodos(): Promise<ProductoResponseDto[]> {
    const productos = await this.productoRepository.findAll();

    return productos.map((p) => ProductoResponseDto.fromDomain(p));
  }

  async actualizar(
    id: ProductoId,
    request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    // Cargar el producto
    const producto = await this.obtenerProductoPorId(id);

    // Actualizar nombre y descripcion del producto
    const nombreProducto = NombreProducto.crear(request.nombre);
    const descripcionProducto = DescripcionProducto.crear(request.descripcion);
    producto.actualizarInformacion(nombreProducto, descripcionProducto);

    // Cambiar el precio
    if (request.precio) {
      producto.cambiarPrecio(Money.crear(request.precio));
    }

    await this.productoRepository.update(producto);

    return ProductoResponseDto.fromDomain(producto);
  }

  async activar(id: ProductoId): Promise<void> {
    const producto = await this.obtenerProductoPorId(id);
    producto.activar();
    await this.productoRepository.update(producto);
  }

  async desactivar(id: ProductoId): Promise<void> {
    const producto = await this.obtenerProductoPorId(id);
    producto.desactivar();
    await this.productoRepository.update(producto);
  }

  async crearCategoria(
    request: CategoriaRequestDto,
  ): Promise<CategoriaResponseDto> {
    const nombre = request.nombre;
    const descripcion = request.descripcion;
    let categoriaPadreId: CategoriaId | undefined;
    if (request.categoriaPadreId) {
      categoriaPadreId = CategoriaId.of(request.categoriaPadreId);
    }

    const nuevaCategoria = Categoria.crear(
      nombre,
      descripcion,
      categoriaPadreId,
    );
    await this.categoriaRepository.save(nuevaCategoria);

    return CategoriaResponseDto.fromDomain(nuevaCategoria);
  }

  async buscarCategoriaPorId(id: CategoriaId): Promise<CategoriaResponseDto> {
    const categoria = await this.obtenerCategoriaPorId(id);

    return CategoriaResponseDto.fromDomain(categoria);
  }

  async buscarTodasCategorias(): Promise<CategoriaResponseDto[]> {
    const categorias = await this.categoriaRepository.findAll();

    return categorias.map((c) => CategoriaResponseDto.fromDomain(c));
  }

  async actualizarCategoria(
    id: CategoriaId,
    request: CategoriaRequestDto,
  ): Promise<CategoriaResponseDto> {
    // Cargar el producto
    const categoria = await this.obtenerCategoriaPorId(id);

    // Actualizar nombre y descripcion de la categoria
    const nombreCategoria = request.nombre;
    const descripcionCategoria = request.descripcion;
    categoria.actualizar(nombreCategoria, descripcionCategoria);

    // Cambiar el id de la categoria padre si viene en el request
    if (request.categoriaPadreId) {
      const categoriaPadreId = CategoriaId.of(request.categoriaPadreId);
      categoria.asignarPadre(categoriaPadreId);
    }

    await this.categoriaRepository.update(categoria);

    return CategoriaResponseDto.fromDomain(categoria);
  }

  private async obtenerProductoPorId(id: ProductoId): Promise<Producto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new ProductoException(
        `Producto con ID ${id.getValue()} no encontrado.`,
      );
    }
    return producto;
  }

  private async obtenerCategoriaPorId(id: CategoriaId): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new ProductoException(
        `Categoria con ID ${id.getValue()} no encontrada.`,
      );
    }
    return categoria;
  }
}
