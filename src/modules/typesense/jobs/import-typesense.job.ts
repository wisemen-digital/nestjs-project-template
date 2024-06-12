import { type ModuleRef } from '@nestjs/core'
import { type TestingModule } from '@nestjs/testing'
import { QueueName } from '../../pgboss/types/queue-name.enum.js'
import { PgBossJob } from '../../pgboss/jobs/pgboss.job.js'
import { TypesenseImportService } from '../services/typesense-import.service.js'
import { TypesenseAliasName } from '../collections/typesense.collections.js'

export class ImportTypesenseJob extends PgBossJob {
  protected readonly queueName = QueueName.TYPESENSE

  private readonly _uniqueBy: string = 'typesense-import'
  protected get uniqueBy (): string {
    return this._uniqueBy
  }

  async run (moduleRef: ModuleRef | TestingModule): Promise<void> {
    const typesense = moduleRef.get(TypesenseImportService)

    await typesense.migrate(true, Object.values(TypesenseAliasName))
    await typesense.import(Object.values(TypesenseAliasName))
  }
}
