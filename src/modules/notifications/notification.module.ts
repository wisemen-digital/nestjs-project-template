import { Module } from '@nestjs/common'
import { NatsModule } from '../nats/nats.module.js'
import { NotificationPublisher } from './publishers/notification.publisher.js'
import { NotificationController } from './notification.controller.js'

@Module({
  imports: [
    NatsModule.forRoot()
  ],
  controllers: [
    NotificationController
  ],
  providers: [
    NotificationPublisher
  ],
  exports: [
    NotificationPublisher
  ]
})
export class NotificationModule {}
