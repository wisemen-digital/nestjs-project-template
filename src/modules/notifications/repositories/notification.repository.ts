import { Injectable } from '@nestjs/common'
import { EntityManager, In } from 'typeorm'
import { type UpdateNotificationDto } from '../dtos/update-notification.dto.js'
import { Notification } from '../entities/notification.entity.js'
import { TypeOrmRepository } from '../../typeorm/utils/transaction.js'

@Injectable()
export class NotificationRepository extends TypeOrmRepository<Notification> {
  constructor (entityManager: EntityManager) {
    super(Notification, entityManager)
  }

  public async createOne (
    userUuid: string,
    deviceUuid: string
  ): Promise<Notification> {
    await this.insert({ userUuid, deviceUuid })
    return await this.findOneByOrFail({ userUuid, deviceUuid })
  }

  public async findOrCreateOne (
    userUuid: string,
    deviceUuid: string
  ): Promise<Notification> {
    const notification = await this.findOne({
      where: {
        userUuid,
        deviceUuid
      }
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
    if (dto.state) {
      notification.config |= (1 << dto.bit)
    } else {
      notification.config &= ~(1 << dto.bit)
    }

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
