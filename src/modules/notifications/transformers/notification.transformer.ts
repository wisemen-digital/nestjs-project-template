import { ApiProperty } from '@nestjs/swagger'
import { Transformer } from '@appwise/transformer'
import { notificationContent } from '../content/notification.content.js'
import { type Notification } from '../entities/notification.entity.js'

export class NotificationTransformerType {
  @ApiProperty({ type: 'string', description: 'Title of the notification' })
  title: string

  @ApiProperty({ type: 'number', description: 'Bit value representing notification' })
  bit: number

  @ApiProperty({ type: 'boolean', description: 'Enable or disable' })
  state: boolean

  @ApiProperty({ type: 'number', description: 'Group of the notification' })
  group: number
}

export class NotificationTransformer extends
  Transformer<Notification, NotificationTransformerType[]> {
  transform (
    notification: Notification,
    language: string
  ): NotificationTransformerType[] {
    return notificationContent.map(content => {
      return {
        title: content.title[language],
        bit: content.bit,
        group: content.group,
        state: ((notification.config >> content.bit) & 1) === 1
      }
    })
  }
}
