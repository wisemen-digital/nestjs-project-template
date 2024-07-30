import { ApiProperty } from '@nestjs/swagger'
import { Transformer } from '@appwise/transformer'
import { notificationContent } from '../content/notification.content.js'
import { type Notification } from '../entities/notification.entity.js'
import { getBit } from '../utils/get-bit.util.js'

export class NotificationTransformerType {
  @ApiProperty({ type: 'string', description: 'Title of the notification' })
  title: string

  @ApiProperty({ type: 'number', description: 'Bit value representing notification' })
  bit: number

  @ApiProperty({ type: 'boolean', description: 'Enabled or disabled' })
  state: boolean

  @ApiProperty({ type: 'number', description: 'Group of the notification' })
  group: number
}

export class NotificationTransformer extends
  Transformer<Notification, NotificationTransformerType[]> {
  protected transform (
    notification: Notification,
    language: string
  ): NotificationTransformerType[] {
    return notificationContent.map(content => {
      return {
        title: content.title[language],
        bit: content.bit,
        group: content.group,
        state: getBit(notification.config, content.bit)
      }
    })
  }
}
