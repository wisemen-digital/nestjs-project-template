import { NestFactory } from '@nestjs/core'
import { initSentry } from '../utils/sentry/sentry.js'
import { NatsOutboxModule } from '../modules/nats/outbox/nats-outbox.module.js'

async function bootstrap (): Promise<void> {
  initSentry()

  const app = await NestFactory.createApplicationContext(NatsOutboxModule.forRoot())

  app.enableShutdownHooks()
  await app.init()
}

await bootstrap()
