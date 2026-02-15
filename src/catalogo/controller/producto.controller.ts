import { ProductoService } from '@catalogo/service/producto.service';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductoRequestDto } from './dtos/producto-request.dto';
import { ProductoResponseDto } from './dtos/producto-response.dto';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id';
import { ValueObjectIdPipe } from '@shared/controller/pipes/value-object-id.pipe';

@Controller('producto')
export class ProductoController {
  constructor(
    @Inject('ProductoService')
    private readonly productoService: ProductoService,
  ) {}

  @Post()
  async crear(
    @Body() request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    return await this.productoService.crear(request);
  }

  @Get(':id')
  async obtener(
    @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
  ): Promise<ProductoResponseDto> {
    return await this.productoService.buscarPorId(id);
  }

  @Get()
  async obtenerTodos(): Promise<ProductoResponseDto[]> {
    return await this.productoService.buscarTodos();
  }

  @Put(':id')
  async actualizar(
    @Param('id', new ValueObjectIdPipe(ProductoId)) id: ProductoId,
    @Body() request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    return await this.productoService.actualizar(id, request);
  }

  @Post(':id/activar')
  async activar(id: ProductoId): Promise<void> {
    await this.productoService.activar(id);
  }
}
