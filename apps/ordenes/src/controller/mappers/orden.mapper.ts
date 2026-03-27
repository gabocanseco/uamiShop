import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import {
  DireccionEnvioDto,
  InfoEnvioDto,
  ItemOrdenDto,
  OrdenRequestDto,
  ResumenPagoDto,
} from '@ordenes/controller/dtos/orden-request.dto';
import { ClienteId } from '@app/shared/domain/value-objects/ids/cliente-id.vo';
import { ItemOrden } from '@ordenes/domain/entities/item-orden.entity';
import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { Money } from '@app/shared/domain/value-objects/money.vo';
import { DireccionEnvio } from '@app/shared/domain/value-objects/direccion-envio.vo';
import { ResumenPago } from '@ordenes/domain/value-objects/resumen-pago.vo';
import { plainToInstance } from 'class-transformer';
import { OrdenResponseDto } from '../dtos/orden-response.dto';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import { DateTime } from '@app/shared/domain/value-objects/datetime.vo';

export class OrdenMapper {
  static toDomainId(id: string) {
    return OrdenId.of(id);
  }

  static toDomain(ordenRequestDto: OrdenRequestDto) {
    const clienteId = ClienteId.of(ordenRequestDto.clienteId);
    const items = ordenRequestDto.items.map((itemOrdenDto) =>
      ItemOrdenMapper.toDomain(itemOrdenDto),
    );
    const direccionEnvio = DireccionEnvioMapper.toDomain(
      ordenRequestDto.direccion,
    );
    const resumenPago = ResumenPagoMapper.toDomain(ordenRequestDto.resumenPago);
    return Orden.crear(clienteId, items, direccionEnvio, resumenPago);
  }

  static toResponseDto(orden: Orden) {
    return plainToInstance(OrdenResponseDto, orden.toPrimitives());
  }
}

export class ItemOrdenMapper {
  static toDomain(itemOrdenDto: ItemOrdenDto) {
    const productoId = ProductoId.of(itemOrdenDto.productoId);
    const precioUnitario = Money.crear(itemOrdenDto.precioUnitario);
    return ItemOrden.crear(
      productoId,
      itemOrdenDto.nombreProducto,
      itemOrdenDto.sku,
      itemOrdenDto.cantidad,
      precioUnitario,
    );
  }
}

export class DireccionEnvioMapper {
  static toDomain(direccionEnvioDto: DireccionEnvioDto) {
    return DireccionEnvio.crear(
      direccionEnvioDto.nombreDestinatario,
      direccionEnvioDto.calle,
      direccionEnvioDto.ciudad,
      direccionEnvioDto.estado,
      direccionEnvioDto.codigoPostal,
      direccionEnvioDto.pais,
      direccionEnvioDto.telefono,
      direccionEnvioDto.instrucciones,
    );
  }
}

export class ResumenPagoMapper {
  static toDomain(resumenPagoDto: ResumenPagoDto): ResumenPago {
    return ResumenPago.crear(resumenPagoDto.metodoPago);
  }
}

export class InfoEnvioMapper {
  static toDomain(infoEnvioDto: InfoEnvioDto) {
    const fechaEstimadaEntrega = DateTime.crear(
      infoEnvioDto.fechaEstimadaEntrega,
    );
    return InfoEnvio.crear(
      infoEnvioDto.proveedorLogistico,
      infoEnvioDto.numeroGuia,
      fechaEstimadaEntrega,
    );
  }
}
