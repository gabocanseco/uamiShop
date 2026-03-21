import { CatalogoApi } from '@catalogo/api/interfaces/catalogo.api';
import { Categoria } from '@catalogo/domain/agreggates/categoria.agreggate';
import { Producto } from '@catalogo/domain/agreggates/producto.agreggate';
import { ProductoEstadisticas } from '@catalogo/domain/agreggates/producto-estadisticas.agreggate';
import { Imagen } from '@catalogo/domain/value-objects/imagen';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import type { ICategoriaRepository } from '@catalogo/repository/interfaces/categoria.repository';
import type { IProductoRepository } from '@catalogo/repository/interfaces/producto.repository';
import type { IProductoEstadisticasRepository } from '@catalogo/repository/interfaces/producto-estadisticas.repository';
import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { ProductoInfoDto } from '@catalogo/api/dtos/producto-info.dto';
import { ProductoMapper } from '@catalogo/controller/mappers/producto.mapper';

@Injectable() // Convierte esta clase en un proveedor de servicios que puede ser inyectado en otros componentes de NestJS
export class ProductoService implements CatalogoApi {
  constructor(
    @Inject('IProductoRepository')
    private readonly productoRepository: IProductoRepository,
    @Inject('ICategoriaRepository')
    private readonly categoriaRepository: ICategoriaRepository,
    @Inject('IProductoEstadisticasRepository')
    private readonly productoEstadisticasRepository: IProductoEstadisticasRepository,
  ) {}

  async crear(nuevoProducto: Producto): Promise<Producto> {
    // Verificar que la categoria exista antes de crear el producto
    const _ = await this.buscarCategoriaPorId(nuevoProducto.getCategoriaId());

    await this.productoRepository.save(nuevoProducto);
    return nuevoProducto;
  }

  async obtenerProducto(productoId: ProductoId): Promise<ProductoInfoDto> {
    const producto = await this.buscarPorId(productoId);

    return ProductoMapper.toResponseDto(producto);
  }

  private async buscarPorId(id: ProductoId): Promise<Producto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new EntityNotFoundException('Producto', id.getValue());
    }
    return producto;
  }

  async buscarTodos(): Promise<Producto[]> {
    const productos = await this.productoRepository.findAll();

    return productos;
  }

  async actualizar(id: ProductoId, nuevoProducto: Producto): Promise<Producto> {
    // Cargar el producto
    const producto = await this.buscarPorId(id);

    producto.actualizarInformacion(
      nuevoProducto.getNombre(),
      nuevoProducto.getDescripcion(),
    );

    // Cambiar el precio
    if (nuevoProducto.getPrecio()) {
      producto.cambiarPrecio(nuevoProducto.getPrecio());
    }

    await this.productoRepository.update(producto);

    return producto;
  }

  async activar(id: ProductoId): Promise<void> {
    const producto = await this.buscarPorId(id);
    producto.activar();
    await this.productoRepository.update(producto);
  }

  async desactivar(id: ProductoId): Promise<void> {
    const producto = await this.buscarPorId(id);
    producto.desactivar();
    await this.productoRepository.update(producto);
  }

  async agregarImagen(id: ProductoId, imagen: Imagen): Promise<void> {
    const producto = await this.buscarPorId(id);
    producto.agregarImagen(imagen);
    await this.productoRepository.update(producto);
  }

  async buscarMasVendidos(limit: number): Promise<ProductoEstadisticas[]> {
    return this.productoEstadisticasRepository.findMasVendidos(limit);
  }

  async buscarEstadisticas(id: ProductoId): Promise<ProductoEstadisticas> {
    const estadisticas =
      await this.productoEstadisticasRepository.findByProductoId(id);
    if (!estadisticas) {
      throw new EntityNotFoundException('ProductoEstadisticas', id.getValue());
    }
    return estadisticas;
  }

  async crearCategoria(nuevaCategoria: Categoria): Promise<Categoria> {
    await this.categoriaRepository.save(nuevaCategoria);

    return nuevaCategoria;
  }

  async buscarCategoriaPorId(id: CategoriaId): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findById(id);
    if (!categoria) {
      throw new EntityNotFoundException('Categoria', id.getValue());
    }
    return categoria;
  }

  async buscarTodasCategorias(): Promise<Categoria[]> {
    const categorias = await this.categoriaRepository.findAll();
    return categorias;
  }

  async actualizarCategoria(
    id: CategoriaId,
    nuevaCategoria: Categoria,
  ): Promise<Categoria> {
    // Cargar el producto
    const categoria = await this.buscarCategoriaPorId(id);

    // Actualizar nombre y descripcion de la categoria
    categoria.actualizar(
      nuevaCategoria.getNombre(),
      nuevaCategoria.getDescripcion(),
    );

    // Cambiar el id de la categoria padre si viene en el request
    const categoriaPadreId = nuevaCategoria.getCategoriaPadreId();
    if (categoriaPadreId) {
      categoria.asignarPadre(categoriaPadreId);
    }

    await this.categoriaRepository.update(categoria);

    return categoria;
  }
}
