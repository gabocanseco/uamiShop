import { DataSource } from 'typeorm';

export const TRANSACTION_MANAGER_KEY = 'transactionManager';

export function Transactional(
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  const wrappedMethod = async function (this: any, ...args: any[]) {
    const dataSource = this.dataSource;

    if (!dataSource) {
      throw new Error(
        'DataSource not injected in the service. Add @Inject("DataSource") private readonly dataSource: DataSource to the constructor.',
      );
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

  descriptor.value = wrappedMethod;
  return descriptor;
}