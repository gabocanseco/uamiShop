import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenResponseDto } from '@ordenes/controller/dtos/orden-response.dto';
import {
  InfoEnvioDto,
  MotivoDto,
  OrdenRequestDto,
  ReferenciaExternaDto,
} from '@ordenes/controller/dtos/orden-request.dto';
// import { ValueObjectIdPipe } from '@shared/controller/pipes/value-object-id.pipe';
// import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
// import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
// import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
// import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import {
  InfoEnvioMapper,
  OrdenMapper,
} from '@ordenes/controller/mappers/orden.mapper';
import { OrdenParamsDto } from './dtos/orden-params.dto';

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

  // @Post(':id')
  // async crearDesdeCarrito(
  //   @Param() params: OrdenParamsDto,
  //   @Body() direccionEnvio: DireccionEnvioDto,
  // ): Promise<OrdenResponseDto> {
  //   return await this.ordenService.crearDesdeCarrito(id, direccionEnvio);
  // }

  @Get(':id')
  async obtenerPorId(
    @Param() params: OrdenParamsDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(params.id);

    const orden = await this.ordenService.buscarPorId(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/confirmar')
  async confirmar(@Param() params: OrdenParamsDto): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(params.id);
    const orden = await this.ordenService.confirmar(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/procesar')
  async procesarPago(
    @Param() params: OrdenParamsDto,
    @Body() referenciaExternaDto: ReferenciaExternaDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(params.id);
    const referenciaExterna = referenciaExternaDto.referenciaExterna;

    const orden = await this.ordenService.procesarPago(
      ordenId,
      referenciaExterna,
    );
    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/enproceso')
  async marcarEnProceso(
    @Param() params: OrdenParamsDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(params.id);

    const orden = await this.ordenService.marcarEnProceso(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/enviada')
  async marcarEnviada(
    @Param() params: OrdenParamsDto,
    @Body() infoEnvioDto: InfoEnvioDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(params.id);
    const infoEnvio = InfoEnvioMapper.toDomain(infoEnvioDto);

    const orden = await this.ordenService.marcarEnviada(ordenId, infoEnvio);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/entregada')
  async marcarEntregada(
    @Param() params: OrdenParamsDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(params.id);

    const orden = await this.ordenService.marcarEntregada(ordenId);

    return OrdenMapper.toResponseDto(orden);
  }

  @Post(':id/cancelar')
  async cancelar(
    @Param() params: OrdenParamsDto,
    @Body() motivoDto: MotivoDto,
  ): Promise<OrdenResponseDto> {
    const ordenId = OrdenMapper.toDomainId(params.id);

    const orden = await this.ordenService.cancelar(ordenId, motivoDto.motivo);

    return OrdenMapper.toResponseDto(orden);
  }
}
