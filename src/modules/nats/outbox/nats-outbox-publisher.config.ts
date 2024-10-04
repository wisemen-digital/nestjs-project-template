import * as process from 'node:process'
import { ConfigType, registerAs } from '@nestjs/config'

const config = registerAs('nats-outbox', () => ({
  batchSize: process.env.NATS_OUTBOX_BATCH_SIZE
}))

export type NatsOutboxPublisherConfig = ConfigType<typeof config>

export default config
