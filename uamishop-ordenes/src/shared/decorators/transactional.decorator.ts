import { DataSource } from 'typeorm';

export const TRANSACTION_MANAGER_KEY = 'transactionManager';

export function Transactional(): MethodDecorator {
  return function <T>(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> | void {
    if (!descriptor || !descriptor.value) {
      return descriptor;
    }

    const originalMethod = descriptor.value as (...args: any[]) => Promise<any>;

    const wrappedMethod = async function (this: any, ...args: any[]) {
      const dataSource = this.dataSource;

      if (!dataSource) {
        return originalMethod.apply(this, args);
      }

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const entityManager = queryRunner.manager;
      this[TRANSACTION_MANAGER_KEY] = entityManager;

      try {
        const result = await originalMethod.apply(this, args);
        await queryRunner.commitTransaction();
        return result;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
        delete this[TRANSACTION_MANAGER_KEY];
      }
    };

    (descriptor as any).value = wrappedMethod;
    return descriptor as TypedPropertyDescriptor<T>;
  };
}
