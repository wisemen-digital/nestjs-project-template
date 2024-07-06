import { Module } from '@nestjs/common'
import { NatsModule } from '../nats/nats.module.js'
import { NotificationPublisher } from './publishers/notification.publisher.js'

@Module({
  imports: [
    NatsModule.forRoot()
  ],
  controllers: [],
  providers: [
    NotificationPublisher
  ],
  exports: [
    NotificationPublisher
  ]
})
export class NotificationModule {}
