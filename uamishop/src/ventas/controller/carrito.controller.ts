import {
  Controller,
  Post,
  Param,
  Get,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CarritoResponseDto } from './dtos/carrito-response.dto';
import { CarritoService } from '@ventas/service/carrito.service';
import { CarritoMapper, ProductoRefMapper } from './mappers/carrito.mapper';
import { ClienteParamDto } from '@shared/controller/dtos/cliente-params.dto';
import { ClienteMapper } from '@shared/controller/mappers/cliente.mapper';
import {
  CarritoParamDto,
  CarritoProductoParamsDto,
} from './dtos/carrito-params.dto';
import { CantidadDto, CarritoRequestDto } from './dtos/carrito-request.dto';
import { MoneyMapper } from '@shared/controller/mappers/money.mapper';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';

/**
 * Controller para gestionar las operaciones del carrito de compras
 */
@ApiTags('Carritos')
@Controller('carritos')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  /**
   * Crea un nuevo carrito para un cliente
   * POST /carritos
   */
  @Post(':id')
  @ApiOperation({ summary: 'Crear un carrito' })
  @ApiParam({ name: 'id', description: 'ID del cliente' })
  @ApiResponse({
    status: 201,
    description: 'Carrito creado exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async crear(@Param() param: ClienteParamDto): Promise<CarritoResponseDto> {
    const clienteId = ClienteMapper.toDomainId(param.id);

    const carrito = await this.carritoService.crear(clienteId);

    return CarritoMapper.toResponseDto(carrito);
  }

  /**
   * Obtiene un carrito por ID
   * GET /carritos/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un carrito' })
  @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiResponse({
    status: 200,
    description: 'Carrito obtenido exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Carrito no encontrado' })
  async obtenerCarrito(
    @Param() param: CarritoParamDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(param.id);

    const carrito = await this.carritoService.obtenerCarrito(carritoId);

    return CarritoMapper.toResponseDto(carrito);
  }

  /**
   * Agrega un producto al carrito
   * POST /carritos/:id/productos
   */
  @Post(':id/productos')
  @ApiOperation({ summary: 'Agregar un producto al carrito' })
  @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiBody({ type: CarritoRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Producto agregado al carrito exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async agregarProducto(
    @Param() param: CarritoParamDto,
    @Body() carritoRequestDto: CarritoRequestDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(param.id);
    const productoRef = ProductoRefMapper.toDomain(
      carritoRequestDto.productoRef,
    );
    const cantidad = carritoRequestDto.cantidad;
    const precioUnitario = MoneyMapper.toDomain(
      carritoRequestDto.precioUnitario,
    );

    const carrito = await this.carritoService.agregarProducto(
      carritoId,
      productoRef,
      cantidad,
      precioUnitario,
    );

    return CarritoMapper.toResponseDto(carrito);
  }

  /**
   * Modifica la cantidad de un producto en el carrito
   * PUT /carritos/:id/productos/:productoId
   */
  @Put(':id/productos/:productoId')
  @ApiOperation({
    summary: 'Modificar la cantidad de un producto en el carrito',
  })
  @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiParam({ name: 'productoId', description: 'ID del producto' })
  @ApiBody({ type: CantidadDto })
  @ApiResponse({
    status: 200,
    description: 'Cantidad modificada exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async modificarCantidad(
    @Param() params: CarritoProductoParamsDto,
    @Body() cantidadDto: CantidadDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(params.id);
    const productoId = ProductoId.of(params.productoId);
    const nuevaCantidad = cantidadDto.cantidad;

    const carrito = await this.carritoService.modificarCantidad(
      carritoId,
      productoId,
      nuevaCantidad,
    );

    return CarritoMapper.toResponseDto(carrito);
  }

  /**
   * Elimina un producto del carrito
   * DELETE /carritos/:id/productos/:productoId
   */
  @Delete(':id/productos/:productoId')
  @ApiOperation({ summary: 'Eliminar un producto del carrito' })
  @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiParam({ name: 'productoId', description: 'ID del producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async eliminarProducto(
    @Param() params: CarritoProductoParamsDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(params.id);
    const productoId = CarritoMapper.toDomainId(params.productoId);

    const carrito = await this.carritoService.eliminarProducto(
      carritoId,
      productoId,
    );

    return CarritoMapper.toResponseDto(carrito);
  }

  /**
   * Vacía el carrito eliminando todos los productos
   * DELETE /carritos/:id/productos
   */
  @Delete(':id/productos')
  @ApiOperation({ summary: 'Vaciar el carrito' })
  @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiResponse({
    status: 200,
    description: 'Carrito vaciado exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async vaciar(@Param() param: CarritoParamDto): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(param.id);

    const carrito = await this.carritoService.vaciar(carritoId);

    return CarritoMapper.toResponseDto(carrito);
  }

  /**
   * Inicia el proceso de checkout
   * POST /carritos/:id/checkout
   */
  @Post(':id/checkout')
  @ApiOperation({ summary: 'Iniciar el proceso de checkout' })
  @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiResponse({
    status: 200,
    description: 'Checkout iniciado exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async iniciarCheckout(
    @Param() param: CarritoParamDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(param.id);

    const carrito = await this.carritoService.iniciarCheckout(carritoId);

    return CarritoMapper.toResponseDto(carrito);
  }

  /**
   * Completa el checkout del carrito
   * POST /carritos/:id/checkout/completar
   */
  @Post(':id/completar')
  @ApiOperation({ summary: 'Completar el checkout del carrito' })
  @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiResponse({
    status: 200,
    description: 'Checkout completado exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async completarCheckout(
    @Param() param: CarritoParamDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(param.id);

    const carrito = await this.carritoService.completarCheckout(carritoId);

    return CarritoMapper.toResponseDto(carrito);
  }

  /**
   * Abandona el carrito
   * POST /carritos/:id/abandonar
   */
  @Post(':id/abandonar')
  @ApiOperation({ summary: 'Abandonar el carrito' })
  @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiResponse({
    status: 200,
    description: 'Carrito abandonado exitosamente',
    type: CarritoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async abandonar(
    @Param() param: CarritoParamDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(param.id);

    const carrito = await this.carritoService.abandonar(carritoId);

    return CarritoMapper.toResponseDto(carrito);
  }
}
