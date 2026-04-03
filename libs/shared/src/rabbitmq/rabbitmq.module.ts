import { Module, DynamicModule } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({})
export class SharedRabbitModule {
  static register(exchangeName: string): DynamicModule {
    return {
      module: SharedRabbitModule,
      imports: [
        RabbitMQModule.forRoot({
          exchanges: [
            {
              name: exchangeName,
              type: 'topic', // Tipo topic para usar routing keys
            },
          ],
          uri: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672', // URL de conexión a RabbitMQ, configurable por variable de entorno
          connectionInitOptions: { wait: false }, // No bloquear el inicio si RabbitMQ no está listo
          // Habilita el guardado de mensajes si RabbitMQ se cae momentáneamente
          enableDirectReplyTo: false, // Deshabilitado para evitar errores al reconectar
          connectionManagerOptions: {
            // Reintentar la conexión automáticamente si RabbitMQ no está disponible al inicio
            heartbeatIntervalInSeconds: 15,
            reconnectTimeInSeconds: 5,
          },
        }),
      ],
      exports: [RabbitMQModule],
    };
  }
}
