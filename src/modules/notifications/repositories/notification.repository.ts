import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'
import { type UpdateNotificationDto } from '../dtos/update-notification.dto.js'
import { Notification } from '../entities/notification.entity.js'
import { TypeOrmRepository } from '../../typeorm/utils/transaction.js'
import { setBit } from '../utils/set-bit.util.js'
import { DEFAULT_NOTIFICATION_CONFIG } from '../config/notifications.config.js'

@Injectable()
export class NotificationRepository extends TypeOrmRepository<Notification> {
  constructor (entityManager: EntityManager) {
    super(Notification, entityManager)
  }

  public async createOne (
    userUuid: string,
    deviceUuid: string
  ): Promise<Notification> {
    const config = DEFAULT_NOTIFICATION_CONFIG
    await this.insert({ userUuid, deviceUuid, config })
    return await this.findOneByOrFail({ userUuid, deviceUuid })
  }

  public async findOrCreateOne (
    userUuid: string,
    deviceUuid: string
  ): Promise<Notification> {
    const notification = await this.findOneBy({
      userUuid,
      deviceUuid
    })

    if (notification == null) {
      return await this.createOne(userUuid, deviceUuid)
    }

    return notification
  }

  public async updateOne (
    notification: Notification,
    dto: UpdateNotificationDto
  ): Promise<Notification> {
    notification.config = setBit(notification.config, dto.bit, dto.state)
    return await this.save(notification)
  }

  public async getForUsers (
    userUuids: string[]
  ): Promise<Notification[]> {
    return await this.find({
      where: { userUuid: In(userUuids) }
    })
  }
}
