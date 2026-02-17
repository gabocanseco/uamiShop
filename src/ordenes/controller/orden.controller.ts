import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrdenService } from '@ordenes/service/orden.service';
import { OrdenResponseDto } from './dtos/orden-response.dto';
import { OrdenRequestDto } from './dtos/orden-request.dto';
import { ValueObjectIdPipe } from '@shared/controller/pipes/value-object-id.pipe';
import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';

@Controller()
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post('ordenes')
  async crear(@Body() request: OrdenRequestDto): Promise<OrdenResponseDto> {
    return await this.ordenService.crear(request);
  }

  @Get('ordenes')
  async obtenerTodos(): Promise<OrdenResponseDto[]> {
    return await this.ordenService.buscarTodas();
  }

  @Post('ordenes/:id')
  async crearDesdeCarrito(
    @Param('id', new ValueObjectIdPipe(CarritoId)) id: CarritoId,
    @Body('direccionEnvio') direccionEnvio: DireccionEnvio,
  ): Promise<OrdenResponseDto> {
    return await this.ordenService.crearDesdeCarrito(id, direccionEnvio);
  }

  @Get('ordenes/:id')
  async obtenerPorId(
    @Param('id', new ValueObjectIdPipe(OrdenId)) id: OrdenId,
  ): Promise<OrdenResponseDto> {
    return await this.ordenService.buscarPorId(id);
  }

  @Post('ordenes/:id/confirmar')
  async confirmar(
    @Param('id', new ValueObjectIdPipe(OrdenId)) id: OrdenId,
  ): Promise<OrdenResponseDto> {
    return await this.ordenService.confirmar(id);
  }

  @Post('ordenes/:id/procesar')
  async procesarPago(
    @Param('id', new ValueObjectIdPipe(OrdenId)) id: OrdenId,
    @Body('referenciaPago') referenciaPago: string,
  ): Promise<OrdenResponseDto> {
    return await this.ordenService.procesarPago(id, referenciaPago);
  }

  @Post('ordenes/:id/enproceso')
  async marcarEnProceso(
    @Param('id', new ValueObjectIdPipe(OrdenId)) id: OrdenId,
  ): Promise<OrdenResponseDto> {
    return await this.ordenService.marcarEnProceso(id);
  }

  @Post('ordenes/:id/enviada')
  async marcarEnviada(
    @Param('id', new ValueObjectIdPipe(OrdenId)) id: OrdenId,
    @Body('infoEnvio') infoEnvio: InfoEnvio,
  ): Promise<OrdenResponseDto> {
    return await this.ordenService.marcarEnviada(id, infoEnvio);
  }

  @Post('ordenes/:id/entregada')
  async marcarEntregada(
    @Param('id', new ValueObjectIdPipe(OrdenId)) id: OrdenId,
  ): Promise<OrdenResponseDto> {
    return await this.ordenService.marcarEntregada(id);
  }

  @Post('ordenes/:id/cancelar')
  async cancelar(
    @Param('id', new ValueObjectIdPipe(OrdenId)) id: OrdenId,
    @Body('motivo') motivo: string,
  ): Promise<OrdenResponseDto> {
    return await this.ordenService.cancelar(id, motivo);
  }
}
