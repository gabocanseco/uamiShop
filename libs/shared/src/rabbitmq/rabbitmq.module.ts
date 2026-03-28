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
          connectionInitOptions: { wait: true },
          // Habilita el guardado de mensajes si RabbitMQ se cae momentáneamente
          enableDirectReplyTo: true,
        }),
      ],
      exports: [RabbitMQModule],
    };
  }
}
