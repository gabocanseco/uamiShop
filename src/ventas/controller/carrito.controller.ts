import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { CarritoResponseDto } from './dtos/carrito-response.dto';
import {
  CrearCarritoDto,
  AgregarProductoDto,
  ModificarCantidadDto,
} from './dtos/carrito-request.dto';
import { CarritoService } from '@ventas/service/carrito.service';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { NombreProducto } from '@catalogo/domain/value-objects/nombre-producto.vo';
import { VentaException } from '@ventas/domain/exceptions/venta.exception';

/**
 * TODO: Mover a la carpeta controller/dtos y usar un DTO combinado compuesto si es necesario
 * DTOs para las operaciones del controller
 */
interface CrearVentaDto {
  clienteId: string;
  lineas: {
    productoId: string;
    cantidad: number;
    precioUnitario: number;
    moneda?: string;
  }[];
  descuento?: {
    porcentaje?: number;
    monto?: number;
    moneda?: string;
  };
  impuesto?: {
    porcentaje: number;
    monto?: number;
    moneda?: string;
  };
  referenciaPago?: string;
  notas?: string;
}

interface AgregarLineaDto {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  moneda?: string;
}

interface ActualizarLineaDto {
  indice: number;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  moneda?: string;
}

interface AplicarDescuentoDto {
  porcentaje?: number;
  monto?: number;
  moneda?: string;
}

// interface AplicarImpuestoDto {
//   porcentaje: number;
//   monto?: number;
//   moneda?: string;
// }

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
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async crear(@Body() dto: CrearCarritoDto): Promise<CarritoResponseDto> {
    try {
      const clienteId = ClienteId.of(dto.clienteId);
      return await this.carritoService.crear(clienteId);
    } catch (error) {
      if (error instanceof VentaException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Obtiene un carrito por ID
   * GET /carritos/:id
   */
  @Get(':id')
  async obtenerCarrito(@Param('id') id: string): Promise<CarritoResponseDto> {
    try {
      const carritoId = CarritoId.of(id);
      return await this.carritoService.obtenerCarrito(carritoId);
    } catch (error) {
      if (error instanceof VentaException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  /**
   * Agrega un producto al carrito
   * POST /carritos/:id/productos
   */
  @Post(':id/productos')
  async agregarProducto(
    @Param('id') id: string,
    @Body() dto: AgregarProductoDto,
  ): Promise<CarritoResponseDto> {
    try {
      const carritoId = CarritoId.of(id);
      const productoId = ProductoId.of(dto.productoId);
      const nombreProducto = NombreProducto.crear(dto.nombreProducto);
      const productoRef = ProductoRef.crear(
        productoId,
        nombreProducto,
        dto.sku || '',
      );
      const precioUnitario = Money.crear(
        dto.precioUnitario,
        dto.moneda || 'MXN',
      );

      return await this.carritoService.agregarProducto(
        carritoId,
        productoRef,
        dto.cantidad,
        precioUnitario,
      );
    } catch (error) {
      if (error instanceof VentaException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Modifica la cantidad de un producto en el carrito
   * PUT /carritos/:id/productos/:productoId
   */
  @Put(':id/productos/:productoId')
  async modificarCantidad(
    @Param('id') id: string,
    @Param('productoId') productoId: string,
    @Body() dto: ModificarCantidadDto,
  ): Promise<CarritoResponseDto> {
    try {
      const carritoId = CarritoId.of(id);
      const prodId = ProductoId.of(productoId);

      return await this.carritoService.modificarCantidad(
        carritoId,
        prodId,
        dto.nuevaCantidad,
      );
    } catch (error) {
      if (error instanceof VentaException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Elimina un producto del carrito
   * DELETE /carritos/:id/productos/:productoId
   */
  @Delete(':id/productos/:productoId')
  @HttpCode(HttpStatus.OK)
  async eliminarProducto(
    @Param('id') id: string,
    @Param('productoId') productoId: string,
  ): Promise<CarritoResponseDto> {
    try {
      const carritoId = CarritoId.of(id);
      const prodId = ProductoId.of(productoId);

      return await this.carritoService.eliminarProducto(carritoId, prodId);
    } catch (error) {
      if (error instanceof VentaException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Vacía el carrito eliminando todos los productos
   * DELETE /carritos/:id/productos
   */
  @Delete(':id/productos')
  @HttpCode(HttpStatus.OK)
  async vaciar(@Param('id') id: string): Promise<CarritoResponseDto> {
    try {
      const carritoId = CarritoId.of(id);
      return await this.carritoService.vaciar(carritoId);
    } catch (error) {
      if (error instanceof VentaException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Inicia el proceso de checkout
   * POST /carritos/:id/checkout
   */
  @Post(':id/checkout')
  async iniciarCheckout(@Param('id') id: string): Promise<CarritoResponseDto> {
    try {
      const carritoId = CarritoId.of(id);
      return await this.carritoService.iniciarCheckout(carritoId);
    } catch (error) {
      if (error instanceof VentaException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Completa el checkout del carrito
   * POST /carritos/:id/checkout/completar
   */
  @Post(':id/checkout/completar')
  async completarCheckout(
    @Param('id') id: string,
  ): Promise<CarritoResponseDto> {
    try {
      const carritoId = CarritoId.of(id);
      return await this.carritoService.completarCheckout(carritoId);
    } catch (error) {
      if (error instanceof VentaException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  /**
   * Abandona el carrito
   * POST /carritos/:id/abandonar
   */
  @Post(':id/abandonar')
  async abandonar(@Param('id') id: string): Promise<CarritoResponseDto> {
    try {
      const carritoId = CarritoId.of(id);
      return await this.carritoService.abandonar(carritoId);
    } catch (error) {
      if (error instanceof VentaException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
