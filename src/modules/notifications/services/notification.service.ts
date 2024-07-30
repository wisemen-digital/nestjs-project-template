import { Injectable } from '@nestjs/common'
import { NotificationRepository } from '../repositories/notification.repository.js'
import { type UpdateNotificationDto } from '../dtos/update-notification.dto.js'
import { type Notification } from '../entities/notification.entity.js'

@Injectable()
export class NotificationService {
  constructor (
    private readonly notificationRepository: NotificationRepository
  ) {}

  public async findOrCreateNotification (
    userUuid: string, deviceUuid: string
  ): Promise<Notification> {
    return await this.notificationRepository.findOrCreateOne(userUuid, deviceUuid)
  }

  public async updateNotification (
    userUuid: string,
    deviceUuid: string,
    dto: UpdateNotificationDto
  ): Promise<Notification> {
    const notification = await this.findOrCreateNotification(userUuid, deviceUuid)
    return await this.notificationRepository.updateOne(notification, dto)
  }
}
