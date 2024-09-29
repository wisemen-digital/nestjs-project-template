import { DataSource } from 'typeorm'
import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import { PgBossService } from '../../modules/pgboss/services/pgboss.service.js'
import { ImportTypesenseJob } from '../../modules/typesense/jobs/import-typesense.job.js'
import { AppModule } from '../../app.module.js'

export class ImportTypesenseCronjob extends JobContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(
      AppModule.forRoot([])
    )
  }

  async execute (app: INestApplicationContext): Promise<void> {
    const scheduler = app.get(PgBossService)
    const dataSource = app.get(DataSource)

    const job = ImportTypesenseJob.create()

    await scheduler.scheduleJobs(dataSource.manager, [job])
  }
}

const _importTypesenseCronjob = new ImportTypesenseCronjob()
