import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenResponseDto } from '@ordenes/controller/dtos/orden-response.dto';
import {
  InfoEnvioDto,
  MotivoDto,
  OrdenDesdeCarritoDto,
  OrdenRequestDto,
  ReferenciaExternaDto,
} from '@ordenes/controller/dtos/orden-request.dto';
import {
  DireccionEnvioMapper,
  InfoEnvioMapper,
  OrdenMapper,
  ResumenPagoMapper,
} from '@ordenes/controller/mappers/orden.mapper';
import { OrdenParamDto } from '@ordenes/controller/dtos/orden-params.dto';
import { CarritoId } from '@app/shared/domain/value-objects/ids/carrito-id.vo';
import { CarritoParamDto } from '@app/shared/controller/dtos/carrito-params.dto';

@ApiTags('Ordenes')
@Controller('ordenes')
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiBody({ type: OrdenRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async crear(@Body() request: OrdenRequestDto): Promise<OrdenResponseDto> {
    const nuevaOrden = OrdenMapper.toDomain(request);

    const orden = await this.ordenService.crear(nuevaOrden);

    return OrdenMapper.toResponseDto(orden);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes',
    type: [OrdenResponseDto],
  })
  async obtenerTodos(): Promise<OrdenResponseDto[]> {
    const ordenes = await this.ordenService.buscarTodas();

    return ordenes.map((orden) => OrdenMapper.toResponseDto(orden));
  }

  @Post(':id')
  @ApiOperation({ summary: 'Crear una orden desde un carrito' })
  // @ApiParam({ name: 'id', description: 'ID del carrito' })
  @ApiBody({ type: OrdenDesdeCarritoDto })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async crearDesdeCarrito(
    @Param() params: CarritoParamDto,
    @Body() ordenDesdeCarrito: OrdenDesdeCarritoDto,
  ): Promise<OrdenResponseDto> {
    const carritoId = CarritoId.of(params.id);
    const direccionEnvio = DireccionEnvioMapper.toDomain(
      ordenDesdeCarrito.direccionEnvio,
    );
    const resumenPago = ResumenPagoMapper.toDomain(
      ordenDesdeCarrito.resumenPago,
    );
    const orden = await this.ordenService.crearDesdeCarrito(
      carritoId,
      direccionEnvio,
      resumenPago,
    );

    return OrdenMapper.toResponseDto(orden);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener orden por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la orden',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden encontrada',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async obtenerPorId(@Param() param: OrdenParamDto): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);

    const orden = await this.ordenService.buscarPorId(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/confirmar')
  @ApiOperation({ summary: 'Confirmar una orden' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden confirmada',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async confirmar(@Param() param: OrdenParamDto): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);
    const orden = await this.ordenService.confirmar(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/procesar')
  @ApiOperation({ summary: 'Procesar pago de una orden' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiBody({ type: ReferenciaExternaDto })
  @ApiResponse({
    status: 200,
    description: 'Pago procesado',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async procesarPago(
    @Param() param: OrdenParamDto,
    @Body() referenciaExternaDto: ReferenciaExternaDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);
    const referenciaExterna = referenciaExternaDto.referenciaExterna;

    const orden = await this.ordenService.procesarPago(
      ordenId,
      referenciaExterna,
    );
    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/enproceso')
  @ApiOperation({ summary: 'Marcar orden como en proceso' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden marcada como en proceso',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async marcarEnProceso(
    @Param() param: OrdenParamDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);

    const orden = await this.ordenService.marcarEnProceso(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/enviada')
  @ApiOperation({ summary: 'Marcar orden como enviada' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiBody({ type: InfoEnvioDto })
  @ApiResponse({
    status: 200,
    description: 'Orden marcada como enviada',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async marcarEnviada(
    @Param() param: OrdenParamDto,
    @Body() infoEnvioDto: InfoEnvioDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);
    const infoEnvio = InfoEnvioMapper.toDomain(infoEnvioDto);

    const orden = await this.ordenService.marcarEnviada(ordenId, infoEnvio);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/entregada')
  @ApiOperation({ summary: 'Marcar orden como entregada' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiResponse({
    status: 200,
    description: 'Orden marcada como entregada',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async marcarEntregada(
    @Param() param: OrdenParamDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);

    const orden = await this.ordenService.marcarEntregada(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar una orden' })
  @ApiParam({ name: 'id', description: 'ID de la orden' })
  @ApiBody({ type: MotivoDto })
  @ApiResponse({
    status: 200,
    description: 'Orden cancelada',
    type: OrdenResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async cancelar(
    @Param() param: OrdenParamDto,
    @Body() motivoDto: MotivoDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);

    const orden = await this.ordenService.cancelar(ordenId, motivoDto.motivo);

    return OrdenMapper.toResponseDto(orden);
  }
}
