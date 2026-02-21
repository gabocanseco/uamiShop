import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
import { CarritoParamDto } from '@ventas/controller/dtos/carrito-params.dto';
import { CarritoMapper } from '@ventas/controller/mappers/carrito.mapper';

@Controller('ordenes')
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post()
  async crear(@Body() request: OrdenRequestDto): Promise<OrdenResponseDto> {
    const nuevaOrden = OrdenMapper.toDomain(request);

    const orden = await this.ordenService.crear(nuevaOrden);

    return OrdenMapper.toResponseDto(orden);
  }

  @Get()
  async obtenerTodos(): Promise<OrdenResponseDto[]> {
    const ordenes = await this.ordenService.buscarTodas();

    return ordenes.map((orden) => OrdenMapper.toResponseDto(orden));
  }

  @Post(':id')
  async crearDesdeCarrito(
    @Param() param: CarritoParamDto,
    @Body() ordenDesdeCarrito: OrdenDesdeCarritoDto,
  ): Promise<OrdenResponseDto> {
    const carritoId = CarritoMapper.toDomainId(param.id);
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
  async obtenerPorId(@Param() param: OrdenParamDto): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);

    const orden = await this.ordenService.buscarPorId(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/confirmar')
  async confirmar(@Param() param: OrdenParamDto): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);
    const orden = await this.ordenService.confirmar(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/procesar')
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
  async marcarEnProceso(
    @Param() param: OrdenParamDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);

    const orden = await this.ordenService.marcarEnProceso(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/enviada')
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
  async marcarEntregada(
    @Param() param: OrdenParamDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);

    const orden = await this.ordenService.marcarEntregada(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/cancelar')
  async cancelar(
    @Param() param: OrdenParamDto,
    @Body() motivoDto: MotivoDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(param.id);

    const orden = await this.ordenService.cancelar(ordenId, motivoDto.motivo);

    return OrdenMapper.toResponseDto(orden);
  }
}
