import { ResumenPago } from '@ordenes/domain/value-objects/resumen-pago.vo';
import { ResumenPagoOrmEmbeddable } from '@ordenes/infrastructure/persistance/embeddables/resumen-pago-orm.embeddable';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';

export class ResumenPagoOrmMapper {
  static toDomain(entity: ResumenPagoOrmEmbeddable): ResumenPago {
    return ResumenPago.reconstruct({
      metodoPago: entity.metodoPago,
      estado: entity.estado,
      referenciaExterna: entity.referenciaExterna || undefined,
      fechaProcesamiento: entity.fechaProcesamiento
        ? DateTime.crear(entity.fechaProcesamiento)
        : undefined,
    });
  }

  static toPersistance(resumenPago: ResumenPago): ResumenPagoOrmEmbeddable {
    const entity = new ResumenPagoOrmEmbeddable();
    entity.metodoPago = resumenPago.getMetodoPago();
    entity.estado = resumenPago.getEstado();
    entity.referenciaExterna = resumenPago.getReferenciaExterna() || null;
    entity.fechaProcesamiento = resumenPago.getFechaProcesamiento()
      ? resumenPago.getFechaProcesamiento()!.getValue()
      : null;
    return entity;
  }
}
