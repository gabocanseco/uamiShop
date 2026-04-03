import { DomainException } from '@app/shared/domain/exceptions/domain.exception';

export class ExternalServiceUnavailableException extends DomainException {
  constructor(public readonly serviceName: string) {
    super(`El servicio externo ${serviceName} no está disponible actualmente.`);
    this.name = 'ExternalServiceUnavailableException';
  }
}
