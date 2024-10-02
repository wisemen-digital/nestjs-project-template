import { NestFactory } from '@nestjs/core'
import { WorkerContainer } from '@wisemen/app-container'
import { INestApplicationContext } from '@nestjs/common'
import { NatsOutboxModule } from '../modules/nats/outbox/nats-outbox.module.js'

class Worker extends WorkerContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(NatsOutboxModule.forRoot())
  }
}

const _worker = new Worker()
