import { ProductoService } from '@catalogo/service/producto.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductoRequestDto } from '@catalogo/controller/dtos/producto-request.dto';
import { ProductoResponseDto } from '@catalogo/controller/dtos/producto-response.dto';
import { CategoriaRequestDto } from '@catalogo/controller/dtos/categoria-request.dto';
import { CategoriaResponseDto } from '@catalogo/controller/dtos/categoria-response.dto';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { ProductoMapper } from '@catalogo/controller/mappers/producto.mapper';
import { CategoriaMapper } from '@catalogo/controller/mappers/categoria.mapper';
import { ProductoParamsDto } from '@catalogo/controller/dtos/producto-params.dto';

@Controller()
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post('productos')
  async crear(
    @Body() request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    const nuevoProducto = ProductoMapper.toDomain(request);

    const producto = await this.productoService.crear(nuevoProducto);

    return ProductoMapper.toResponseDto(producto);
  }

  @Get('productos')
  async obtenerTodos(): Promise<ProductoResponseDto[]> {
    const productos = await this.productoService.buscarTodos();

    return productos.map((p) => ProductoMapper.toResponseDto(p));
  }

  @Get('productos/:id')
  async obtener(
    @Param() params: ProductoParamsDto,
  ): Promise<ProductoResponseDto> {
    const productoId = ProductoMapper.toDomainId(params.id);

    const producto = await this.productoService.buscarPorId(productoId);

    return ProductoMapper.toResponseDto(producto);
  }

  @Put('productos/:id')
  async actualizar(
    @Param() params: ProductoParamsDto,
    @Body() request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    const productoId = ProductoMapper.toDomainId(params.id);

    const nuevoProducto = ProductoMapper.toDomain(request);

    const producto = await this.productoService.actualizar(
      productoId,
      nuevoProducto,
    );

    return ProductoMapper.toResponseDto(producto);
  }

  @Post('productos/:id/activar')
  async activar(@Param() params: ProductoParamsDto): Promise<void> {
    const productoId = ProductoMapper.toDomainId(params.id);
    await this.productoService.activar(productoId);
  }

  @Post('productos/:id/desactivar')
  async desactivar(@Param() params: ProductoParamsDto): Promise<void> {
    const productoId = ProductoMapper.toDomainId(params.id);
    await this.productoService.desactivar(productoId);
  }

  @Post('categorias')
  async crearCategoria(
    @Body() request: CategoriaRequestDto,
  ): Promise<CategoriaResponseDto> {
    const nuevaCategoria = CategoriaMapper.toDomain(request);

    const categoria = await this.productoService.crearCategoria(nuevaCategoria);

    return CategoriaMapper.toResponseDto(categoria);
  }

  @Get('categorias')
  async obtenerTodasCategorias(): Promise<CategoriaResponseDto[]> {
    const categorias = await this.productoService.buscarTodasCategorias();

    return categorias.map((c) => CategoriaMapper.toResponseDto(c));
  }

  @Get('categorias/:id')
  async obtenerCategoriaPorId(
    @Param('id') id: string,
  ): Promise<CategoriaResponseDto> {
    const categoriaId = CategoriaMapper.toDomainId(id);

    const categoria =
      await this.productoService.buscarCategoriaPorId(categoriaId);

    return CategoriaMapper.toResponseDto(categoria);
  }

  @Put('categorias/:id')
  async actualizarCategoria(
    @Param('id') id: string,
    @Body() request: CategoriaRequestDto,
  ): Promise<CategoriaResponseDto> {
    const categoriaId = CategoriaId.of(id);
    const nuevaCategoria = CategoriaMapper.toDomain(request);

    const categoria = await this.productoService.actualizarCategoria(
      categoriaId,
      nuevaCategoria,
    );

    return CategoriaMapper.toResponseDto(categoria);
  }
}
