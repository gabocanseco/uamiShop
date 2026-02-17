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
 * Controller para gestionar las operaciones de ventas
 */
@Controller('ventas')
export class CarritoController {
  async crear(clienteId: ClienteId): Promise<CarritoResponseDto> {}

  async obtenerCarrito(carritoId: CarritoId): Promise<CarritoResponseDto> {}

  // Aquí no debe haber logica de validación, deben estar en el dto o en el service
  // Aqui debe de recibir un DTO y transformarlo a los objetos de dominio necesarios para agregar el producto al carrito
  async agregaProducto(
    carritoId: CarritoId,
    prodictoRef: ProductoRef,
    cantidad: number,
    precioUnitario: Money,
  ): Promise<CarritoResponseDto> {}

  // Aqui debe de recibir un DTO y transformarlo a los objetos de dominio necesarios para agregar el producto al carrito
  async modificarCantidad(
    carritoId: CarritoId,
    productoId: ProductoId,
    nuevaCantidad: number,
  ): Promise<CarritoResponseDto> {}

  async eliminarProducto(
    carritoId: CarritoId,
    productoId: ProductoId,
  ): Promise<CarritoResponseDto> {}

  async vaciar(carritoId: CarritoId): Promise<CarritoResponseDto> {}

  async iniciarCheckout(carritoId: CarritoId): Promise<CarritoResponseDto> {}

  async completarCheckout(carritoId: CarritoId): Promise<CarritoResponseDto> {}

  async abandonar(carritoId: CarritoId): Promise<CarritoResponseDto> {}

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
