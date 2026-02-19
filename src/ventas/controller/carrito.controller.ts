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

  // TODO: Inyectar el servicio o repositorio de ventas cuando esté disponible
  // constructor(private readonly ventaService: VentaService) {}

  /**
   * Crea una nueva venta
   * POST /ventas
   */
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async crear(@Body() dto: CrearVentaDto): Promise<any> {
  //   try {
  //     // Validar que haya al menos una línea
  //     if (!dto.lineas || dto.lineas.length === 0) {
  //       throw new BadRequestException('La venta debe tener al menos una línea');
  //     }

  //     // Crear las líneas de venta
  //     const lineas = dto.lineas.map((lineaDto) => {
  //       const productoId = ProductoId.of(lineaDto.productoId);
  //       const precioUnitario = Money.crear(
  //         lineaDto.precioUnitario,
  //         lineaDto.moneda || 'MXN',
  //       );
  //       return ItemCarrito.crear(productoId, lineaDto.cantidad, precioUnitario);
  //     });
  //     // Crear el cliente ID
  //     const clienteId = ClienteId.of(dto.clienteId);

  //     // Crear descuento si se proporciona
  //     let descuento: Descuento | undefined;
  //     if (dto.descuento) {
  //       if (dto.descuento.monto !== undefined) {
  //         descuento = Descuento.conMonto(
  //           Money.crear(dto.descuento.monto, dto.descuento.moneda || 'MXN'),
  //         );
  //       } else if (dto.descuento.porcentaje !== undefined) {
  //         descuento = Descuento.conPorcentaje(dto.descuento.porcentaje);
  //       }
  //     }

  //     // Crear impuesto si se proporciona
  //     let impuesto: Impuesto | undefined;
  //     if (dto.impuesto) {
  //       const montoImpuesto = dto.impuesto.monto
  //         ? Money.crear(dto.impuesto.monto, dto.impuesto.moneda || 'MXN')
  //         : Money.crear(0, dto.impuesto.moneda || 'MXN');
  //       impuesto = Impuesto.create(dto.impuesto.porcentaje, montoImpuesto);
  //     }

  //     // Crear referencia de pago si se proporciona
  //     const referenciaPago = dto.referenciaPago
  //       ? ReferenciaPago.create(dto.referenciaPago)
  //       : undefined;

  //     // Crear notas si se proporcionan
  //     const notas = dto.notas
  //       ? NotasVenta.create(dto.notas)
  //       : NotasVenta.vacia();

  //     // Crear la venta
  //     const venta = Venta.crear(
  //       lineas,
  //       clienteId,
  //       descuento,
  //       impuesto,
  //       referenciaPago,
  //       notas,
  //     );

  //     // TODO: Guardar en el repositorio
  //     // await this.ventaService.guardar(venta);

  //     return this.toResponse(venta);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw error;
  //   }
  // }

  // /**
  //  * Obtiene una venta por ID
  //  * GET /ventas/:id
  //  */
  // @Get(':id')
  // async obtenerPorId(@Param('id') id: string): Promise<any> {
  //   try {
  //     const ventaId = ItemCarritoId.create(id);

  //     // TODO: Buscar en el repositorio
  //     // const venta = await this.ventaService.obtenerPorId(ventaId);
  //     // if (!venta) {
  //     //   throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //     // }

  //     // Placeholder - remover cuando se implemente el servicio
  //     throw new NotFoundException(`Venta con ID ${id} no encontrada`);

  //     // return this.toResponse(venta);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new BadRequestException('ID de venta inválido');
  //   }
  // }

  // /**
  //  * Obtiene todas las ventas
  //  * GET /ventas
  //  */
  // @Get()
  // async obtenerTodas(): Promise<any[]> {
  //   // TODO: Implementar paginación y filtros
  //   // const ventas = await this.ventaService.obtenerTodas();
  //   // return ventas.map(venta => this.toResponse(venta));

  //   return [];
  // }

  // /**
  //  * Agrega una línea a una venta existente
  //  * POST /ventas/:id/lineas
  //  */
  // @Post(':id/lineas')
  // async agregarLinea(
  //   @Param('id') id: string,
  //   @Body() dto: AgregarLineaDto,
  // ): Promise<any> {
  //   try {
  //     const ventaId = ItemCarritoId.create(id);

  //     // TODO: Obtener venta del repositorio
  //     // const venta = await this.ventaService.obtenerPorId(ventaId);
  //     // if (!venta) {
  //     //   throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //     // }

  //     // Crear la nueva línea
  //     const productoId = ProductoId.of(dto.productoId);
  //     const precioUnitario = Money.crear(
  //       dto.precioUnitario,
  //       dto.moneda || 'MXN',
  //     );
  //     const nuevaLinea = ItemCarrito.crear(
  //       productoId,
  //       dto.cantidad,
  //       precioUnitario,
  //     );

  //     // TODO: Agregar línea y guardar
  //     // const ventaActualizada = venta.agregarLinea(nuevaLinea);
  //     // await this.ventaService.actualizar(ventaActualizada);

  //     // return this.toResponse(ventaActualizada);

  //     throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw error;
  //   }
  // }

  // /**
  //  * Actualiza una línea de venta
  //  * PUT /ventas/:id/lineas
  //  */
  // @Put(':id/lineas')
  // async actualizarLinea(
  //   @Param('id') id: string,
  //   @Body() dto: ActualizarLineaDto,
  // ): Promise<any> {
  //   try {
  //     const ventaId = ItemCarritoId.create(id);

  //     // TODO: Obtener venta del repositorio
  //     // const venta = await this.ventaService.obtenerPorId(ventaId);
  //     // if (!venta) {
  //     //   throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //     // }

  //     // Crear la línea actualizada
  //     const productoId = ProductoId.of(dto.productoId);
  //     const precioUnitario = Money.crear(
  //       dto.precioUnitario,
  //       dto.moneda || 'MXN',
  //     );
  //     const lineaActualizada = ItemCarrito.crear(
  //       productoId,
  //       dto.cantidad,
  //       precioUnitario,
  //     );

  //     // TODO: Actualizar línea y guardar
  //     // const ventaActualizada = venta.actualizarLinea(dto.indice, lineaActualizada);
  //     // await this.ventaService.actualizar(ventaActualizada);

  //     // return this.toResponse(ventaActualizada);

  //     throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw error;
  //   }
  // }

  // /**
  //  * Elimina una línea de venta
  //  * DELETE /ventas/:id/lineas/:indice
  //  */
  // @Delete(':id/lineas/:indice')
  // async eliminarLinea(
  //   @Param('id') id: string,
  //   @Param('indice') indice: string,
  // ): Promise<any> {
  //   try {
  //     const ventaId = ItemCarritoId.create(id);
  //     const indiceNumerico = parseInt(indice, 10);

  //     if (isNaN(indiceNumerico)) {
  //       throw new BadRequestException('Índice inválido');
  //     }

  //     // TODO: Obtener venta del repositorio
  //     // const venta = await this.ventaService.obtenerPorId(ventaId);
  //     // if (!venta) {
  //     //   throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //     // }

  //     // TODO: Eliminar línea y guardar
  //     // const ventaActualizada = venta.eliminarLinea(indiceNumerico);
  //     // await this.ventaService.actualizar(ventaActualizada);

  //     // return this.toResponse(ventaActualizada);

  //     throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw error;
  //   }
  // }

  // /**
  //  * Aplica un descuento a la venta
  //  * PUT /ventas/:id/descuento
  //  */
  // @Put(':id/descuento')
  // async aplicarDescuento(
  //   @Param('id') id: string,
  //   @Body() dto: AplicarDescuentoDto,
  // ): Promise<any> {
  //   try {
  //     const ventaId = ItemCarritoId.create(id);

  //     // TODO: Obtener venta del repositorio
  //     // const venta = await this.ventaService.obtenerPorId(ventaId);
  //     // if (!venta) {
  //     //   throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //     // }

  //     // Crear descuento
  //     let descuento: Descuento;
  //     if (dto.monto !== undefined) {
  //       descuento = Descuento.conMonto(
  //         Money.crear(dto.monto, dto.moneda || 'MXN'),
  //       );
  //     } else if (dto.porcentaje !== undefined) {
  //       descuento = Descuento.conPorcentaje(dto.porcentaje);
  //     } else {
  //       throw new BadRequestException(
  //         'Debe proporcionar porcentaje o monto de descuento',
  //       );
  //     }

  //     // TODO: Aplicar descuento y guardar
  //     // const ventaActualizada = venta.aplicarDescuento(descuento);
  //     // await this.ventaService.actualizar(ventaActualizada);

  //     // return this.toResponse(ventaActualizada);

  //     throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw error;
  //   }
  // }

  // /**
  //  * Aplica un impuesto a la venta
  //  * PUT /ventas/:id/impuesto
  //  */
  // @Put(':id/impuesto')
  // async aplicarImpuesto(
  //   @Param('id') id: string,
  //   @Body() dto: AplicarImpuestoDto,
  // ): Promise<any> {
  //   try {
  //     const ventaId = ItemCarritoId.create(id);

  //     // TODO: Obtener venta del repositorio
  //     // const venta = await this.ventaService.obtenerPorId(ventaId);
  //     // if (!venta) {
  //     //   throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //     // }

  //     // Crear impuesto
  //     const montoImpuesto = dto.monto
  //       ? Money.crear(dto.monto, dto.moneda || 'MXN')
  //       : Money.crear(0, dto.moneda || 'MXN');
  //     const impuesto = Impuesto.create(dto.porcentaje, montoImpuesto);

  //     // TODO: Aplicar impuesto y guardar
  //     // const ventaActualizada = venta.aplicarImpuesto(impuesto);
  //     // await this.ventaService.actualizar(ventaActualizada);

  //     // return this.toResponse(ventaActualizada);

  //     throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw error;
  //   }
  // }

  // /**
  //  * Completa una venta
  //  * POST /ventas/:id/completar
  //  */
  // @Post(':id/completar')
  // async completar(@Param('id') id: string): Promise<any> {
  //   try {
  //     const ventaId = ItemCarritoId.create(id);

  //     // TODO: Obtener venta del repositorio
  //     // const venta = await this.ventaService.obtenerPorId(ventaId);
  //     // if (!venta) {
  //     //   throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //     // }

  //     // TODO: Completar venta y guardar
  //     // const ventaCompletada = venta.completar();
  //     // await this.ventaService.actualizar(ventaCompletada);

  //     // return this.toResponse(ventaCompletada);

  //     throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw error;
  //   }
  // }

  // /**
  //  * Cancela una venta
  //  * POST /ventas/:id/cancelar
  //  */
  // @Post(':id/cancelar')
  // async cancelar(@Param('id') id: string): Promise<any> {
  //   try {
  //     const ventaId = ItemCarritoId.create(id);

  //     // TODO: Obtener venta del repositorio
  //     // const venta = await this.ventaService.obtenerPorId(ventaId);
  //     // if (!venta) {
  //     //   throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //     // }

  //     // TODO: Cancelar venta y guardar
  //     // const ventaCancelada = venta.cancelar();
  //     // await this.ventaService.actualizar(ventaCancelada);

  //     // return this.toResponse(ventaCancelada);

  //     throw new NotFoundException(`Venta con ID ${id} no encontrada`);
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     if (error instanceof Error) {
  //       throw new BadRequestException(error.message);
  //     }
  //     throw error;
  //   }
  // }

  // /**
  //  * Convierte una entidad Venta a un objeto de respuesta
  //  */
  // private toResponse(venta: Venta): any {
  //   return {
  //     id: venta.id.value,
  //     clienteId: venta.idCliente.getValue(),
  //     subtotal: {
  //       cantidad: venta.subtotal.getCantidad(),
  //       moneda: venta.subtotal.codigoMoneda,
  //     },
  //     descuento: {
  //       porcentaje: venta.descuento.porcentaje,
  //       monto: venta.descuento.monto
  //         ? {
  //             cantidad: venta.descuento.monto.getCantidad(),
  //             moneda: venta.descuento.monto.codigoMoneda,
  //           }
  //         : null,
  //     },
  //     impuesto: {
  //       porcentaje: venta.impuesto.porcentaje,
  //       monto: {
  //         cantidad: venta.impuesto.monto.getCantidad(),
  //         moneda: venta.impuesto.monto.codigoMoneda,
  //       },
  //     },
  //     total: {
  //       cantidad: venta.total.getCantidad(),
  //       moneda: venta.total.codigoMoneda,
  //     },
  //     estado: venta.estado.value,
  //     referenciaPago: venta.referenciaPago?.value,
  //     notas: venta.notas.value,
  //     fecha: venta.fecha.toISOString(),
  //     lineas: venta.lineas.map((linea, indice) => ({
  //       indice,
  //       productoId: linea.productoId.getValue(),
  //       cantidad: linea.cantidad.valor,
  //       precioUnitario: {
  //         cantidad: linea.precioUnitario.getCantidad(),
  //         moneda: linea.precioUnitario.codigoMoneda,
  //       },
  //       total: {
  //         cantidad: linea.total.getCantidad(),
  //         moneda: linea.total.codigoMoneda,
  //       },
  //     })),
  //   };
  // }
}
