import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenOrmEntity } from '@ordenes/infrastructure/persistance/entities/orden-orm.entity';
import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { DateTime } from '@shared/domain/value-objects/datetime.vo';
import { MoneyOrmMapper } from '@shared/infrastructure/persistance/mappers/money-orm.mapper';
import { DireccionEnvioOrmMapper } from '@ordenes/infrastructure/persistance/mappers/direccion-envio-orm.mapper';
import { ItemOrdenOrmMapper } from '@ordenes/infrastructure/persistance/mappers/item-orden-orm.mapper';
import { ResumenPagoOrmMapper } from '@ordenes/infrastructure/persistance/mappers/resumen-pago-orm.mapper';
import { CambioEstadoOrmMapper } from '@ordenes/infrastructure/persistance/mappers/cambio-estado-orm.mapper';
import { InfoEnvioOrmMapper } from '@ordenes/infrastructure/persistance/mappers/info-envio-orm.mapper';

export class OrdenOrmMapper {
  static toDomain(entity: OrdenOrmEntity): Orden {
    return Orden.reconstruct({
      id: OrdenId.of(entity.id),
      numeroOrden: entity.numeroOrden,
      clienteId: ClienteId.of(entity.clienteId),
      items: entity.items.map((item) => ItemOrdenOrmMapper.toDomain(item)),
      direccionEnvio: DireccionEnvioOrmMapper.toDomain(entity.direccionEnvio),
      resumenPago: ResumenPagoOrmMapper.toDomain(entity.resumenPago),
      subtotal: MoneyOrmMapper.toDomain(entity.subtotal),
      descuento: MoneyOrmMapper.toDomain(entity.descuento),
      total: MoneyOrmMapper.toDomain(entity.total),
      estado: entity.estado,
      fechaCreacion: DateTime.crear(entity.fechaCreacion),
      historialEstados: entity.historialEstados.map((historial) =>
        CambioEstadoOrmMapper.toDomain(historial),
      ),
      infoEnvio: InfoEnvioOrmMapper.toDomain(entity.infoEnvio),
    });
  }

  static toPersistance(orden: Orden): OrdenOrmEntity {
    const entity = new OrdenOrmEntity();
    entity.id = orden.getId().getValue();
    entity.numeroOrden = orden.getNumeroOrden();
    entity.clienteId = orden.getClienteId().getValue();
    entity.items = orden
      .getItems()
      .map((item) => ItemOrdenOrmMapper.toPersistance(item));
    entity.direccionEnvio = DireccionEnvioOrmMapper.toPersistance(
      orden.getDireccionEnvio(),
    );
    entity.resumenPago = ResumenPagoOrmMapper.toPersistance(
      orden.getResumenPago(),
    );
    entity.subtotal = MoneyOrmMapper.toPersistance(orden.getSubtotal());
    entity.descuento = MoneyOrmMapper.toPersistance(orden.getDescuento());
    entity.total = MoneyOrmMapper.toPersistance(orden.getTotal());
    entity.estado = orden.getEstado();
    entity.fechaCreacion = orden.getFechaCreacion().getValue();
    entity.historialEstados = orden
      .obtenerHistorial()
      .map((historial) => CambioEstadoOrmMapper.toPersistance(historial));
    entity.infoEnvio = InfoEnvioOrmMapper.toPersistance(orden.getInfoEnvio());
    return entity;
  }
}
