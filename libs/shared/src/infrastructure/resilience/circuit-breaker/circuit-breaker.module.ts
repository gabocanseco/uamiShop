import { DynamicModule, Module, Provider } from '@nestjs/common';
import CircuitBreaker from 'opossum';

@Module({})
export class ResilienceModule {
  static register(
    serviceName: string,
    options?: CircuitBreaker.Options,
  ): DynamicModule {
    const providerToken = `${serviceName.toUpperCase()}_BREAKER`;

    const breakerProvider: Provider = {
      provide: providerToken,
      useFactory: () => {
        // Passthrough: ejecuta la función (action) que se le pase a fire()
        const passthrough = (action: () => Promise<any>) => action();
        return new CircuitBreaker(passthrough, {
          timeout: 3000,
          errorThresholdPercentage: 50,
          resetTimeout: 10000,
          ...options, // Permite sobrescribir la config si un micro es más lento
        });
      },
    };

    return {
      module: ResilienceModule,
      providers: [breakerProvider],
      exports: [providerToken],
    };
  }
}
