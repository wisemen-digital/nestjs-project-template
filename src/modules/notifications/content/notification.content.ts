import { type LanguageStringMap } from '@onesignal/node-onesignal'
import { NotificationType } from './notification.type.js'

export interface NotificationContentType {
  bit: NotificationType
  group: number
  title: LanguageStringMap
  content: LanguageStringMap
}

export const notificationContent: NotificationContentType[] = [
  {
    bit: NotificationType.EXAMPLE,
    title: {
      en: 'Example title',
      nl: 'Voorbeeld titel'
    },
    content: {
      en: 'Example content.',
      nl: 'Voorbeeld subtitel.'
    },
    group: 0
  }
]

export function getContentForType (
  type: NotificationType
): { heading: LanguageStringMap, content: LanguageStringMap } {
  const notification = notificationContent.find(notification => notification.bit === type)

  if (notification == null) {
    throw new Error(`Notification type ${type} not found`)
  }

  return {
    heading: notification.title,
    content: notification.content
  }
}
