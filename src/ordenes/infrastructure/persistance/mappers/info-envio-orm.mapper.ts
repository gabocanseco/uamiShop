import { InfoEnvio } from '@ordenes/domain/value-objects/info-envio.vo';
import { InfoEnvioOrmEmbeddable } from '@ordenes/infrastructure/persistance/embeddables/info-envio-orm.embeddable';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';

export class InfoEnvioOrmMapper {

  static toDomain(
    entity: InfoEnvioOrmEmbeddable | undefined,
  ): InfoEnvio | undefined {
    // Devuelve InfoEnvio o undefined dependiendo de si la información de envío es completa o no
    if (
      !entity ||
      !entity.proveedorLogistico ||
      !entity.numeroGuia ||
      !entity.fechaEtimadaEntrega
    ) {
      return undefined;
    }

    return InfoEnvio.reconstruct({
      proveedorLogistico: entity.proveedorLogistico!,
      numeroGuia: entity.numeroGuia!,
      fechaEtimadaEntrega: DateTime.crear(entity.fechaEtimadaEntrega!),
    });
  }

  static toPersistance(
    infoEnvio: InfoEnvio | undefined,
  ): InfoEnvioOrmEmbeddable | undefined {
    if (!infoEnvio) {
      return undefined;
    }
    const entity = new InfoEnvioOrmEmbeddable();
    entity.proveedorLogistico = infoEnvio.getProveedorLogistico();
    entity.numeroGuia = infoEnvio.getNumeroGuia();
    entity.fechaEtimadaEntrega = infoEnvio.getFechaEtimadaEntrega().getValue();
    return entity;
  }
}
