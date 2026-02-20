import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let code = 'INTERNAL_ERROR';

    // Manejo de tus excepciones de dominio genéricas
    if (exception instanceof EntityNotFoundException) {
      status = HttpStatus.NOT_FOUND; // 404
      message = exception.message;
      code = 'ENTITY_NOT_FOUND';
    } else if (exception instanceof BusinessRuleException) {
      status = HttpStatus.CONFLICT; // 409
      message = exception.message;
      code = exception.code || 'LOGIC_CONFLICT';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      errorCode: code,
      timestamp: new Date().toISOString(),
    });
  }
}
