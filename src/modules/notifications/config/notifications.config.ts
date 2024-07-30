import { NotificationType } from '../content/notification.type.js'
import { setBit } from '../utils/set-bit.util.js'

export const DEFAULT_ENABLED_NOTIFICATIONS = [
  NotificationType.EXAMPLE
]

export const DEFAULT_NOTIFICATION_CONFIG = DEFAULT_ENABLED_NOTIFICATIONS
  .reduce((config, type) => setBit(config, type, true), 0)
