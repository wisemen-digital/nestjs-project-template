import { DataSource } from 'typeorm'
import { PgBossService } from '../../modules/pgboss/services/pgboss.service.js'
import { ImportTypesenseJob } from '../../modules/typesense/jobs/import-typesense.job.js'
import { AbstractCronjob } from './abstract-cronjob/abstract-cronjob.js'

export class ImportTypesenseCronjob extends AbstractCronjob {
  async execute (): Promise<void> {
    const scheduler = this.app.get(PgBossService)
    const dataSource = this.app.get(DataSource)

    const job = ImportTypesenseJob.create()

    await scheduler.scheduleJobs(dataSource.manager, [job])
  }
}
