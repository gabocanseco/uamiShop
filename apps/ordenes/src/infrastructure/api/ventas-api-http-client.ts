import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CarritoResumenDto } from '@ordenes/service/external_services/ventas/dtos/carrito-resumen.dto';
import { VentasApi } from '@ordenes/service/external_services/ventas/interfaces/ventas.api';
import { DomainException } from '@app/shared/domain/exceptions/domain.exception';
import { EntityNotFoundException } from '@app/shared/domain/exceptions/entity-not-found.exception';
import { CarritoId } from '@app/shared/domain/value-objects/ids/carrito-id.vo';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import CircuitBreaker from 'opossum';
import { ExternalServiceUnavailableException } from '@app/shared/domain/exceptions/service-unaviable.exception';

@Injectable()
export class VentasApiHttpClient implements VentasApi {
  private readonly ventasBaseUrl?: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('VENTAS_BREAKER')
    private readonly ventasBreaker: CircuitBreaker,
  ) {
    this.ventasBaseUrl = this.configService.get<string>('services.ventasUrl');

    console.log('DEBUG URL VENTAS:', `"${this.ventasBaseUrl}"`);

    if (!this.ventasBaseUrl) {
      throw new DomainException(
        'La URL del servicio de ventas no está configurada',
      );
    }

    this.ventasBreaker.on('open', () =>
      console.warn('CIRCUIT BREAKER OPEN: VENTAS'),
    );
    this.ventasBreaker.on('close', () =>
      console.log('CIRCUIT BREAKER CLOSED: VENTAS'),
    );
    this.ventasBreaker.on('halfOpen', () =>
      console.log('CIRCUIT BREAKER HALF-OPEN: VENTAS'),
    );
  }

  async obtenerResumenCarrito(
    carritoId: CarritoId,
  ): Promise<CarritoResumenDto> {
    const url = `${this.ventasBaseUrl}/v1/carritos/${carritoId.getValue()}`;

    const action = () =>
      firstValueFrom(this.httpService.get<CarritoResumenDto>(url));

    try {
      const { data } = await (this.ventasBreaker.fire(action) as Promise<any>);
      return data;
    } catch (error) {
      console.error('Error Detallado en VentasApiHttpClient:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        isAxiosError: !!error.isAxiosError,
        response: error.response?.data, // Si el otro micro respondió algo
      });

      // Identificamos si el error es porque el circuito está abierto
      if (error.code === 'EOPEN') {
        throw new ExternalServiceUnavailableException('VENTAS');
      }

      // Errores de conexión (servicio caído, red inaccesible, timeout del breaker)
      const connectionErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET', 'EPIPE'];
      if (connectionErrors.includes(error.code) || error.message?.includes('Timed out')) {
        throw new ExternalServiceUnavailableException('VENTAS');
      }

      // Manejo de errores normales de Axios
      const axiosError = error as AxiosError;

      // Si Axios no pudo conectar (sin response = servicio caído)
      if (axiosError.isAxiosError && !axiosError.response) {
        throw new ExternalServiceUnavailableException('VENTAS');
      }

      if (axiosError.response?.status === 404) {
        throw new EntityNotFoundException('Carrito', carritoId.getValue());
      }

      throw new DomainException(
        'Error al comunicarse con el servicio de ventas',
      );
    }
  }
}
