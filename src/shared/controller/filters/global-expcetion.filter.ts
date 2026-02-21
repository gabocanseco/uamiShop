import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';
import { EntityNotFoundException } from '@shared/domain/exceptions/entity-not-found.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      message = (responseBody as any).message || responseBody;
      code = 'VALIDATION_ERROR';
    }

    // Manejo de tus excepciones de dominio genéricas
    if (exception instanceof EntityNotFoundException) {
      status = HttpStatus.NOT_FOUND; // 404
      message = exception.message;
      code = 'ENTITY_NOT_FOUND';
    } else if (exception instanceof BusinessRuleException) {
      status = HttpStatus.BAD_REQUEST; // 400
      message = exception.message;
      code = exception.code || 'BAD_REQUEST';
    }

    this.logger.error(
      `Http Status: ${status} | Method: ${request.method} | URL: ${request.url} | Body: ${JSON.stringify(request.body)}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    response.status(status).json({
      statusCode: status,
      message: message,
      errorCode: code,
      timestamp: new Date().toISOString(),
    });
  }
}
