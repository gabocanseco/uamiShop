import { ProductoService } from '@catalogo/service/producto.service';
import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Put, Query, UseFilters } from '@nestjs/common';
import { ProductoRequestDto } from '@catalogo/controller/dtos/producto-request.dto';
import { ProductoResponseDto } from '@catalogo/controller/dtos/producto-response.dto';
import { CategoriaRequestDto } from '@catalogo/controller/dtos/categoria-request.dto';
import { CategoriaResponseDto } from '@catalogo/controller/dtos/categoria-response.dto';
import { CategoriaId } from '@catalogo/domain/value-objects/ids/categoria-id.vo';
import { ProductoMapper } from '@catalogo/controller/mappers/producto.mapper';
import { CategoriaMapper } from '@catalogo/controller/mappers/categoria.mapper';
import { ProductoEstadisticasMapper } from '@catalogo/controller/mappers/producto-estadisticas.mapper';
import { ProductoParamDto } from '@catalogo/controller/dtos/producto-params.dto';
import { CategoriaParamDto } from '@catalogo/controller/dtos/categoria-params.dto';
import { Imagen } from '@catalogo/domain/value-objects/imagen';
import { ImagenId } from '@catalogo/domain/value-objects/ids/imagen-id.vo';
import { ProductoEstadisticasResponseDto } from '@catalogo/controller/dtos/producto-estadisticas-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@shared/controller/filters/global-expcetion.filter';

@UseFilters(GlobalExceptionFilter)
@Controller()
export class ProductoController {
  constructor(private readonly productoService: ProductoService) { }

  @Post('productos')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiBody({ type: ProductoRequestDto })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: ProductoResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async crear(
    @Body() request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    const nuevoProducto = ProductoMapper.toDomain(request);

    const producto = await this.productoService.crear(nuevoProducto);

    return ProductoMapper.toResponseDto(producto);
  }

  @Get('productos')
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: [ProductoResponseDto] })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async obtenerTodos(): Promise<ProductoResponseDto[]> {
    const productos = await this.productoService.buscarTodos();

    return productos.map((p) => ProductoMapper.toResponseDto(p));
  }

  @Get('productos/mas-vendidos')
  @ApiOperation({ summary: 'Productos más vendidos' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Cantidad de productos a retornar' })
  @ApiResponse({ status: 200, description: 'Lista de productos más vendidos', type: [ProductoEstadisticasResponseDto] })
  async masVendidos(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ProductoEstadisticasResponseDto[]> {
    const estadisticas = await this.productoService.buscarMasVendidos(limit);
    return estadisticas.map((e) => ProductoEstadisticasMapper.toResponseDto(e));
  }

  @Get('productos/:id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto obtenido exitosamente', type: ProductoResponseDto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async obtener(
    @Param() param: ProductoParamDto,
  ): Promise<ProductoResponseDto> {
    const productoId = ProductoMapper.toDomainId(param.id);

    const producto = await this.productoService.buscarPorId(productoId);

    return ProductoMapper.toResponseDto(producto);
  }

  @Get('productos/:id/estadisticas')
  @ApiOperation({ summary: 'Estadísticas de un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Estadísticas del producto', type: ProductoEstadisticasResponseDto })
  @ApiResponse({ status: 404, description: 'Estadísticas no encontradas' })
  async estadisticas(
    @Param() param: ProductoParamDto,
  ): Promise<ProductoEstadisticasResponseDto> {
    const productoId = ProductoMapper.toDomainId(param.id);
    const estadisticas = await this.productoService.buscarEstadisticas(productoId);
    return ProductoEstadisticasMapper.toResponseDto(estadisticas);
  }

  @Put('productos/:id')
  @ApiOperation({ summary: 'Actualizar un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiBody({ type: ProductoRequestDto })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente', type: ProductoResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async actualizar(
    @Param() param: ProductoParamDto,
    @Body() request: ProductoRequestDto,
  ): Promise<ProductoResponseDto> {
    const productoId = ProductoMapper.toDomainId(param.id);

    const nuevoProducto = ProductoMapper.toDomain(request);

    const producto = await this.productoService.actualizar(
      productoId,
      nuevoProducto,
    );

    return ProductoMapper.toResponseDto(producto);
  }

  @Post('productos/:id/activar')
  @ApiOperation({ summary: 'Activar un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async activar(@Param() param: ProductoParamDto): Promise<void> {
    const productoId = ProductoMapper.toDomainId(param.id);
    await this.productoService.activar(productoId);
  }

  @Post('productos/:id/desactivar')
  @ApiOperation({ summary: 'Desactivar un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async desactivar(@Param() param: ProductoParamDto): Promise<void> {
    const productoId = ProductoMapper.toDomainId(param.id);
    await this.productoService.desactivar(productoId);
  }

  @Post('productos/:id/imagenes')
  @ApiOperation({ summary: 'Agregar una imagen a un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
        alt: { type: 'string' },
        orden: { type: 'number' },
      },
    },
  })
  @Post('agregar-imagen')
  @ApiResponse({ status: 201, description: 'Imagen agregada exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiOperation({ summary: 'Agregar una imagen a un producto' })

  async agregarImagen(
    @Param() param: ProductoParamDto,
    @Body() body: { url: string; alt: string; orden: number },
  ): Promise<void> {
    const productoId = ProductoMapper.toDomainId(param.id);
    const imagen = Imagen.crear(
      ImagenId.generar(),
      body.url,
      body.alt,
      body.orden,
    );
    await this.productoService.agregarImagen(productoId, imagen);
  }

  @Post('categorias')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiBody({ type: CategoriaRequestDto })
  @ApiResponse({ status: 201, description: 'Categoría creada exitosamente', type: CategoriaResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async crearCategoria(
    @Body() request: CategoriaRequestDto,
  ): Promise<CategoriaResponseDto> {
    const nuevaCategoria = CategoriaMapper.toDomain(request);

    const categoria = await this.productoService.crearCategoria(nuevaCategoria);

    return CategoriaMapper.toResponseDto(categoria);
  }

  @Get('categorias')
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías', type: [CategoriaResponseDto] })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })

  async obtenerTodasCategorias(): Promise<CategoriaResponseDto[]> {
    const categorias = await this.productoService.buscarTodasCategorias();

    return categorias.map((c) => CategoriaMapper.toResponseDto(c));
  }

  @Get('categorias/:id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría obtenida exitosamente', type: CategoriaResponseDto })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async obtenerCategoriaPorId(
    @Param() param: CategoriaParamDto,
  ): Promise<CategoriaResponseDto> {
    const categoriaId = CategoriaMapper.toDomainId(param.id);

    const categoria =
      await this.productoService.buscarCategoriaPorId(categoriaId);

    return CategoriaMapper.toResponseDto(categoria);
  }

  @Put('categorias/:id')
  @ApiOperation({ summary: 'Actualizar una categoría por ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiBody({ type: CategoriaRequestDto })
  @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente', type: CategoriaResponseDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async actualizarCategoria(
    @Param() param: CategoriaParamDto,
    @Body() request: CategoriaRequestDto,
  ): Promise<CategoriaResponseDto> {
    const categoriaId = CategoriaId.of(param.id);
    const nuevaCategoria = CategoriaMapper.toDomain(request);

    const categoria = await this.productoService.actualizarCategoria(
      categoriaId,
      nuevaCategoria,
    );

    return CategoriaMapper.toResponseDto(categoria);
  }
}
