import { vi } from 'vitest';

vi.mock('@golevelup/nestjs-rabbitmq', () => ({
  AmqpConnection: class {
    publish = vi.fn().mockResolvedValue(true);
    channel = { close: vi.fn() };
    connect = vi.fn();
    setupChannel = vi.fn();
  },
  RabbitMQModule: {
    forRoot: () => ({ module: class {}, exports: [] }),
  },
  RabbitSubscribe: vi.fn().mockImplementation(() => (target: any) => target),
  RabbitSubscriber: vi.fn().mockImplementation(() => (target: any) => target),
}));
