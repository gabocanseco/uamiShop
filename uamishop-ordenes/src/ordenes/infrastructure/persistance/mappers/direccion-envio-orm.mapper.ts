import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
import { DireccionEnvioOrmEmbeddable } from '@ordenes/infrastructure/persistance/embeddables/direccion-envio-orm.embeddable';

export class DireccionEnvioOrmMapper {
  static toDomain(entity: DireccionEnvioOrmEmbeddable): DireccionEnvio {
    return DireccionEnvio.reconstruct({
      nombreDestinatario: entity.nombreDestinatario,
      calle: entity.calle,
      ciudad: entity.ciudad,
      estado: entity.estado,
      codigoPostal: entity.codigoPostal,
      pais: entity.pais,
      telefono: entity.telefono,
      instrucciones: entity.instrucciones,
    });
  }

  static toPersistance(
    direccionEnvio: DireccionEnvio,
  ): DireccionEnvioOrmEmbeddable {
    const entity = new DireccionEnvioOrmEmbeddable();
    entity.nombreDestinatario = direccionEnvio.getNombreDestinatario();
    entity.calle = direccionEnvio.getCalle();
    entity.ciudad = direccionEnvio.getCiudad();
    entity.estado = direccionEnvio.getEstado();
    entity.codigoPostal = direccionEnvio.getCodigoPostal();
    entity.pais = direccionEnvio.getPais();
    entity.telefono = direccionEnvio.getTelefono();
    entity.instrucciones = direccionEnvio.getInstrucciones();
    return entity;
  }
}
