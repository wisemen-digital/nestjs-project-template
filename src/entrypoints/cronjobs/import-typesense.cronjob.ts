import { NestFactory } from '@nestjs/core'
import { DataSource } from 'typeorm'
import { AppModule } from '../../app.module.js'
import { initSentry } from '../../utils/sentry.js'
import { PgBossService } from '../../modules/pgboss/services/pgboss.service.js'
import { ImportTypesenseJob } from '../../modules/typesense/jobs/import-typesense.job.js'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.createApplicationContext(
    AppModule.forRoot([])
  )

  initSentry()

  const scheduler = app.get(PgBossService)
  const dataSource = app.get(DataSource)

  const job = ImportTypesenseJob.create()

  await scheduler.scheduleJobs(dataSource.manager, [job])

  await app.close()
}

await bootstrap()
