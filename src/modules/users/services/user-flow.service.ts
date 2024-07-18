import { Injectable } from '@nestjs/common'
import { TypesenseCollectionService } from '../../typesense/services/typesense-collection.service.js'
import { type CreateUserDto } from '../dtos/create-user.dto.js'
import { TypesenseCollectionName } from '../../typesense/enums/typesense-collection-index.enum.js'
import { type User } from '../entities/user.entity.js'
import { type UpdateUserDto } from '../dtos/update-user.dto.js'
import { type UpdatePasswordDto } from '../dtos/update-password.dto.js'
import { type UserQuery } from '../queries/user.query.js'
import { NotificationService } from '../../notifications/services/notification.service.js'
import { type Notification } from '../../notifications/entities/notification.entity.js'
import { type UpdateNotificationDto } from '../../notifications/dtos/update-notification.dto.js'
import { UserService } from './user.service.js'

@Injectable()
export class UserFlowService {
  constructor (
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,

    private readonly typesenseService: TypesenseCollectionService
  ) {}

  public async findPaginatedAndCount (query: UserQuery): Promise<[User[], number]> {
    return await this.userService.findPaginated(query)
  }

  public async findOneOrFail (userUuid: string): Promise<User> {
    return await this.userService.findOneOrFail(userUuid)
  }

  public async create (dto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(dto)
    await this.typesenseService.importManuallyToTypesense(TypesenseCollectionName.USER, [user])

    return user
  }

  public async update (userUuid: string, dto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userService.update(userUuid, dto)
    await this.typesenseService.importManuallyToTypesense(
      TypesenseCollectionName.USER,
      [updatedUser]
    )
    return updatedUser
  }

  public async updatePassword (userUuid: string, dto: UpdatePasswordDto): Promise<User> {
    return await this.userService.updatePassword(userUuid, dto)
  }

  public async delete (userUuid: string): Promise<void> {
    await this.userService.delete(userUuid)
    await this.typesenseService.deleteFromTypesense(TypesenseCollectionName.USER, userUuid)
  }

  public async findNotificationSettings (
    userUuid: string, deviceUuid: string
  ): Promise<Notification> {
    return await this.notificationService.findOrCreateNotification(userUuid, deviceUuid)
  }

  public async updateNotificationSettings (
    userUuid: string, deviceUuid: string, dto: UpdateNotificationDto
  ): Promise<Notification> {
    return await this.notificationService.updateNotification(userUuid, deviceUuid, dto)
  }
}
