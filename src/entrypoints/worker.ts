import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module.js'
import { initSentry } from '../helpers/sentry.js'
import { PgBossWorkerModule } from '../modules/pgboss-worker/pgboss-worker.module.js'
import { QueueName } from '../modules/pgboss/types/queue-name.enum.js'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.createApplicationContext(
    AppModule.forRoot([
      PgBossWorkerModule.register(QueueName.SYSTEM)
    ])
  )

  initSentry()

  app.enableShutdownHooks()

  await app.init()
}

await bootstrap()
