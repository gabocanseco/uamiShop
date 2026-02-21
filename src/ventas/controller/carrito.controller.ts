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
import { ProductoMapper } from '@catalogo/controller/mappers/producto.mapper';

/**
 * Controller para gestionar las operaciones del carrito de compras
 */
@Controller('carritos')
export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  /**
   * Crea un nuevo carrito para un cliente
   * POST /carritos
   */
  @Post(':id')
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
  async agregarProducto(
    @Param() param: CarritoParamDto,
    @Body() carritoRequestDto: CarritoRequestDto,
  ): Promise<CarritoResponseDto> {
    console.log('BODY RECIBIDO:', JSON.stringify(carritoRequestDto, null, 2));

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
  async modificarCantidad(
    @Param() params: CarritoProductoParamsDto,
    @Body() cantidadDto: CantidadDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(params.id);
    const productoId = ProductoMapper.toDomainId(params.productoId);
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
  async abandonar(
    @Param() param: CarritoParamDto,
  ): Promise<CarritoResponseDto> {
    const carritoId = CarritoMapper.toDomainId(param.id);

    const carrito = await this.carritoService.abandonar(carritoId);

    return CarritoMapper.toResponseDto(carrito);
  }
}
