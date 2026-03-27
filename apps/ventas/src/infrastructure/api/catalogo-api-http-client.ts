import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DomainException } from '@app/shared/domain/exceptions/domain.exception';
import { EntityNotFoundException } from '@app/shared/domain/exceptions/entity-not-found.exception';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { ProductoInfoDto } from '@ventas/service/external-services/catalogo/dtos/producto-info.dto';
import { CatalogoApi } from '@ventas/service/external-services/catalogo/interfaces/catalogo.api';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CatalogoApiHttpClient implements CatalogoApi {
  private readonly catalogoBaseUrl?: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogoBaseUrl = this.configService.get<string>(
      'services.catalogoUrl',
    );

    if (!this.catalogoBaseUrl) {
      throw new DomainException(
        'La URL del servicio de catálogo no está configurada',
      );
    }
  }
  async obtenerProducto(productoId: ProductoId): Promise<ProductoInfoDto> {
    const url = `${this.catalogoBaseUrl}/v1/productos/${productoId.getValue()}`;

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<ProductoInfoDto>(url),
      );
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 404) {
        throw new EntityNotFoundException('Producto', productoId.getValue());
      }

      throw new DomainException(
        'Error al comunicarse con el servicio de catálogo',
      );
    }
  }
}
