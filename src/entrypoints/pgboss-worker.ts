import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module.js'
import { initSentry } from '../common/sentry/sentry.js'
import { PgBossWorkerModule } from '../modules/pgboss-worker/pgboss-worker.module.js'
import { QueueName } from '../modules/pgboss/types/queue-name.enum.js'

async function bootstrap (): Promise<void> {
  initSentry()

  const app = await NestFactory.createApplicationContext(
    AppModule.forRoot([
      PgBossWorkerModule.register(QueueName.TYPESENSE)
    ])
  )

  app.enableShutdownHooks()

  await app.init()
}

await bootstrap()
