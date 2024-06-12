import { AsyncLocalStorage } from 'async_hooks'
import { type EntityManager, type DataSource, Repository, type ObjectLiteral, type EntityTarget } from 'typeorm'

const transactionStorage = new AsyncLocalStorage<EntityManager | null>()

export class TypeOrmRepository <T extends ObjectLiteral> extends Repository <T> {
  constructor (entity: EntityTarget<T>, manager: EntityManager) {
    const em = new Proxy(manager, {
      get (target, prop) {
        const manager = transactionStorage.getStore()

        if (manager != null) {
          return manager[prop]
        } else {
          return target[prop]
        }
      }
    })

    super(entity, em)
  }
}

export async function transaction <T> (
  dataSource: DataSource,
  runInTransaction: (entityManager: EntityManager) => Promise<T>
): Promise<T> {
  return await dataSource.transaction(async (manager) => {
    return await transactionStorage.run(manager, async () => {
      return await runInTransaction(manager)
    })
  })
}
