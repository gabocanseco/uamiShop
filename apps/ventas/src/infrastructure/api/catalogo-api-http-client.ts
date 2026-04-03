import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DomainException } from '@app/shared/domain/exceptions/domain.exception';
import { EntityNotFoundException } from '@app/shared/domain/exceptions/entity-not-found.exception';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { ProductoInfoDto } from '@ventas/service/external-services/catalogo/dtos/producto-info.dto';
import { CatalogoApi } from '@ventas/service/external-services/catalogo/interfaces/catalogo.api';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import CircuitBreaker from 'opossum';
import { ExternalServiceUnavailableException } from '@app/shared/domain/exceptions/service-unaviable.exception';

@Injectable()
export class CatalogoApiHttpClient implements CatalogoApi {
  private readonly catalogoBaseUrl?: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('CATALOGO_BREAKER')
    private readonly catalogoBreaker: CircuitBreaker,
  ) {
    this.catalogoBaseUrl = this.configService.get<string>(
      'services.catalogoUrl',
    );

    console.log('DEBUG URL CATALOGO:', `"${this.catalogoBaseUrl}"`);

    if (!this.catalogoBaseUrl) {
      throw new DomainException(
        'La URL del servicio de catálogo no está configurada',
      );
    }

    this.catalogoBreaker.on('open', () =>
      console.warn('CIRCUIT BREAKER OPEN: CATALOGO'),
    );
    this.catalogoBreaker.on('close', () =>
      console.log('CIRCUIT BREAKER CLOSED: CATALOGO'),
    );
    this.catalogoBreaker.on('halfOpen', () =>
      console.log('CIRCUIT BREAKER HALF-OPEN: CATALOGO'),
    );
  }
  async obtenerProducto(productoId: ProductoId): Promise<ProductoInfoDto> {
    const url = `${this.catalogoBaseUrl}/v1/productos/${productoId.getValue()}`;

    const action = () =>
      firstValueFrom(this.httpService.get<ProductoInfoDto>(url));

    try {
      // Ejecutamos la acción mediante el breaker para manejar la resiliencia
      const { data } = await (this.catalogoBreaker.fire(
        action,
      ) as Promise<any>);
      return data;
    } catch (error) {
      console.error('Error Detallado en CatalogoApiHttpClient:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        isAxiosError: !!error.isAxiosError,
        response: error.response?.data, // Si el otro micro respondió algo
      });

      // Identificamos si el error es porque el circuito está abierto
      if (error.code === 'EOPEN') {
        throw new ExternalServiceUnavailableException('CATALOGO');
      }

      // Errores de conexión (servicio caído, red inaccesible, timeout del breaker)
      const connectionErrors = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET', 'EPIPE'];
      if (connectionErrors.includes(error.code) || error.code === 'ETIMEDOUT' || error.message?.includes('Timed out')) {
        throw new ExternalServiceUnavailableException('CATALOGO');
      }

      // Manejo de errores normales de Axios
      const axiosError = error as AxiosError;

      // Si Axios no pudo conectar (sin response = servicio caído)
      if (axiosError.isAxiosError && !axiosError.response) {
        throw new ExternalServiceUnavailableException('CATALOGO');
      }

      if (axiosError.response?.status === 404) {
        throw new EntityNotFoundException('Producto', productoId.getValue());
      }

      throw new DomainException(
        'Error al comunicarse con el servicio de catálogo',
      );
    }
  }
}
