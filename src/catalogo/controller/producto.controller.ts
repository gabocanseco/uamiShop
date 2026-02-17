import { ProductoService } from '@catalogo/service/producto.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProductoRequestDto } from './dtos/producto-request.dto';
import { ProductoResponseDto } from './dtos/producto-response.dto';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { ValueObjectIdPipe } from '@shared/controller/pipes/value-object-id.pipe';
import { CategoriaRequestDto } from './dtos/categoria-request.dto';
import { CategoriaResponseDto } from './dtos/categoria-response.dto';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';

@Controller()
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post('productos')
  async crear(
    @Body() request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    return await this.productoService.crear(request);
  }

  @Get('productos')
  async obtenerTodos(): Promise<ProductoResponseDto[]> {
    return await this.productoService.buscarTodos();
  }

  @Get('productos/:id')
  async obtener(
    @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
  ): Promise<ProductoResponseDto> {
    return await this.productoService.buscarPorId(id);
  }

  @Put('productos/:id')
  async actualizar(
    @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
    @Body() request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    return await this.productoService.actualizar(id, request);
  }

  @Post('productos/:id/activar')
  async activar(
    @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
  ): Promise<void> {
    await this.productoService.activar(id);
  }

  @Post('productos/:id/desactivar')
  async desactivar(
    @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
  ): Promise<void> {
    await this.productoService.desactivar(id);
  }

  @Post('categorias')
  async crearCategoria(
    @Body() request: CategoriaRequestDto,
  ): Promise<CategoriaResponseDto> {
    return await this.productoService.crearCategoria(request);
  }

  @Get('categorias')
  async obtenerTodasCategorias(): Promise<CategoriaResponseDto[]> {
    return await this.productoService.buscarTodasCategorias();
  }

  @Get('categorias/:id')
  async obtenerCategoriaPorId(
    @Param('id', new ValueObjectIdPipe(CategoriaId)) id: CategoriaId,
  ): Promise<CategoriaResponseDto> {
    return await this.productoService.buscarCategoriaPorId(id);
  }

  @Put('categorias/:id')
  async actualizarCategoria(
    @Param('id', new ValueObjectIdPipe(CategoriaId)) id: CategoriaId,
    @Body() request: CategoriaRequestDto,
  ): Promise<CategoriaResponseDto> {
    return await this.productoService.actualizarCategoria(id, request);
  }
}
