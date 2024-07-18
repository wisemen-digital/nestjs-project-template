import { notificationContent } from '../content/notification.content.js'

interface ReadableNotification {
  title: string
  bit: number
  group: number
  state: boolean
}

export function readableNotifcation (language: string): ReadableNotification[] {
  return notificationContent.map(notification => {
    return {
      title: notification.title[language],
      bit: notification.bit,
      group: notification.group,
      state: ((this.config >> notification.bit) & 1) === 1
    }
  })
}
