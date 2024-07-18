import { type NotificationType } from '../content/notification.type.js'

export function isNotificationEnabled (
  type: NotificationType,
  config: number
): boolean {
  return ((config >> type) & 1) === 1
}
