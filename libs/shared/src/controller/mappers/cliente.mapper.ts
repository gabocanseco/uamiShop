import { ClienteId } from '@app/shared/domain/value-objects/ids/cliente-id.vo';

export class ClienteMapper {
  static toDomainId(id: string) {
    return ClienteId.of(id);
  }
}
