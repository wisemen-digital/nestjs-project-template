import { type ModuleRef } from '@nestjs/core'
import { type TestingModule } from '@nestjs/testing'
import { QueueName } from '../../pgboss/types/queue-name.enum.js'
import { PgBossJob } from '../../pgboss/jobs/pgboss.job.js'
import { TypesenseCollectionName } from '../enums/typesense-collection-index.enum.js'
import { TypesenseInitializationService } from '../services/typesense-initialization.service.js'

export class ImportTypesenseJob extends PgBossJob {
  protected readonly queueName = QueueName.TYPESENSE

  private readonly _uniqueBy: string = 'typesense-import'
  protected get uniqueBy (): string {
    return this._uniqueBy
  }

  async run (moduleRef: ModuleRef | TestingModule): Promise<void> {
    const typesense = moduleRef.get(TypesenseInitializationService)

    await typesense.migrate(true, Object.values(TypesenseCollectionName))
    await typesense.import(Object.values(TypesenseCollectionName))
  }
}
