import { ProductoService } from '@catalogo/service/producto.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductoRequestDto } from './dtos/producto-request.dto';
import { ProductoResponseDto } from './dtos/producto-response.dto';
// import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
// import { ValueObjectIdPipe } from '@shared/controller/pipes/value-object-id.pipe';
import { CategoriaRequestDto } from './dtos/categoria-request.dto';
import { CategoriaResponseDto } from './dtos/categoria-response.dto';
// import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { ProductoMapper } from '@catalogo/controller/mappers/producto.mapper';
import { CategoriaMapper } from './mappers/categoria.mapper';

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

  // @Get('productos')
  // async obtenerTodos(): Promise<ProductoResponseDto[]> {
  //   return await this.productoService.buscarTodos();
  // }

  // @Get('productos/:id')
  // async obtener(
  //   @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
  // ): Promise<ProductoResponseDto> {
  //   return await this.productoService.buscarPorId(id);
  // }

  // @Put('productos/:id')
  // async actualizar(
  //   @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
  //   @Body() request: ProductoRequestDto,
  // ): Promise<ProductoResponseDto> {
  //   return await this.productoService.actualizar(id, request);
  // }

  // @Post('productos/:id/activar')
  // async activar(
  //   @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
  // ): Promise<void> {
  //   await this.productoService.activar(id);
  // }

  // @Post('productos/:id/desactivar')
  // async desactivar(
  //   @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
  // ): Promise<void> {
  //   await this.productoService.desactivar(id);
  // }

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

  // @Get('categorias/:id')
  // async obtenerCategoriaPorId(
  //   @Param('id', new ValueObjectIdPipe(CategoriaId)) id: CategoriaId,
  // ): Promise<CategoriaResponseDto> {
  //   return await this.productoService.buscarCategoriaPorId(id);
  // }

  // @Put('categorias/:id')
  // async actualizarCategoria(
  //   @Param('id', new ValueObjectIdPipe(CategoriaId)) id: CategoriaId,
  //   @Body() request: CategoriaRequestDto,
  // ): Promise<CategoriaResponseDto> {
  //   return await this.productoService.actualizarCategoria(id, request);
  // }
}
