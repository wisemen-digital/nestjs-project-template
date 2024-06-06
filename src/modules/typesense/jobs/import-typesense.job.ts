import { type ModuleRef } from '@nestjs/core'
import { type TestingModule } from '@nestjs/testing'
import { randUuid } from '@ngneat/falso'
import { DataSource } from 'typeorm'
import { QueueName } from '../../pgboss/types/queue-name.enum.js'
import { PgBossJob } from '../../pgboss/jobs/pgboss.job.js'
import { TypesenseImportService } from '../services/typesense-import.service.js'
import { TypesenseAliasName } from '../collections/typesense.collections.js'

export class ImportTypesenseJob extends PgBossJob {
  protected readonly queueName = QueueName.TYPESENSE

  public readonly workOrderUuid: string

  protected get uniqueBy (): string {
    return `typesense-${randUuid()}`
  }

  async run (moduleRef: ModuleRef | TestingModule): Promise<void> {
    const dataSource = moduleRef.get(DataSource, { strict: false })
    const typesense = moduleRef.get(TypesenseImportService)

    await dataSource.manager.transaction(async () => {
      await typesense.migrate(true, Object.values(TypesenseAliasName))
      await typesense.import(Object.values(TypesenseAliasName))
    })
  }
}
