import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';
import { EXCHANGES } from '@shared/rabbitmq/constants/exchanges.const';

@Global() // Lo hacemos global para que se pueda inyectar en cualquier parte sin necesidad de importarlo
@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: EXCHANGES.UAMISHOP_EVENTS,
          type: 'topic', // Tipo topic para usar routing keys
        },
      ],
      uri: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  exports: [RabbitMQModule], // Exportamos el módulo para que pueda ser utilizado en otros módulos
})
export class RabbitMQConfigModule {}
