import { CambioEstado } from '@ordenes/domain/value-objects/cambio-estado.vo';
import { CambioEstadoOrmEntity } from '@ordenes/infrastructure/persistance/embeddables/cambio-estado-orm.embeddable';
import { DateTime } from '@app/shared/domain/value-objects/datetime.vo';

export class CambioEstadoOrmMapper {
  static toDomain(entity: CambioEstadoOrmEntity): CambioEstado {
    return CambioEstado.reconstruct({
      estadoNuevo: entity.estadoNuevo,
      fecha: DateTime.crear(entity.fecha),
      motivo: entity.motivo,
      usuario: entity.usuario,
      estadoAnterior: entity.estadoAnterior || undefined,
    });
  }

  static toPersistance(cambio: CambioEstado): CambioEstadoOrmEntity {
    const entity = new CambioEstadoOrmEntity();
    entity.estadoNuevo = cambio.getEstadoNuevo();
    entity.fecha = cambio.getFecha().getValue();
    entity.motivo = cambio.getMotivo();
    entity.usuario = cambio.getUsuario();
    entity.estadoAnterior = cambio.getEstadoAnterior() || null;
    return entity;
  }
}
