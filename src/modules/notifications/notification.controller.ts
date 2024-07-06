import { Controller, Post, Body } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Public } from '../permissions/permissions.decorator.js'
import { NotificationPublisher } from './publishers/notification.publisher.js'
import { CreateNotificationDto } from './dtos/create-notification.dto.js'

@Controller('notifications')
export class NotificationController {
  constructor (
    private readonly notificationPublisher: NotificationPublisher
  ) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The notification has been successfully send.'
  })
  @Public()
  async sendNotificationExample (
    @Body() createNotificationDto: CreateNotificationDto
  ): Promise<void> {
    await this.notificationPublisher.publish(
      createNotificationDto.userUuid,
      createNotificationDto.message
    )
  }
}
