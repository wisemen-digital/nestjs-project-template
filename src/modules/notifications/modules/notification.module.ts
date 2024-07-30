import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OneSignalClient } from '../client/onesignal.client.js'
import { NotificationRepository } from '../repositories/notification.repository.js'
import { NotificationService } from '../services/notification.service.js'
import { NotificationTransformer } from '../transformers/notification.transformer.js'
import { Notification } from '../entities/notification.entity.js'

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [],
  providers: [
    NotificationService,
    NotificationRepository,
    NotificationTransformer,

    OneSignalClient
  ],
  exports: [
    OneSignalClient,
    NotificationService,
    NotificationTransformer
  ]
})
export class NotificationModule {}
