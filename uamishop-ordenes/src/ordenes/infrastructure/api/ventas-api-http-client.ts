import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CarritoResumenDto } from '@ordenes/service/external_services/ventas/dtos/carrito-resumen.dto';
import { VentasApi } from '@ordenes/service/external_services/ventas/interfaces/ventas.api';
import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';
import { CarritoId } from '@shared/domain/value-objects/ids/carrito-id.vo';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VentasApiHttpClient implements VentasApi {
  private readonly ventasBaseUrl?: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ventasBaseUrl = this.configService.get<string>('services.ventasUrl');

    if (!this.ventasBaseUrl) {
      throw new DomainException(
        'La URL del servicio de ventas no está configurada',
      );
    }
  }

  async obtenerResumenCarrito(
    carritoId: CarritoId,
  ): Promise<CarritoResumenDto> {
    const url = `${this.ventasBaseUrl}/v1/carritos/${carritoId.getValue()}`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<CarritoResumenDto>(url),
      );
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 404) {
        throw new EntityNotFoundException('Carrito', carritoId.getValue());
      }

      throw new DomainException(
        'Error al comunicarse con el servicio de ventas',
      );
    }
  }
}
