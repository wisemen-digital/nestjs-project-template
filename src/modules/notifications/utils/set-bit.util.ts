import { type NotificationType } from '../content/notification.type.js'

export function setBit (config: number, position: NotificationType, value: boolean): number
export function setBit (config: number, position: number, value: boolean): number
export function setBit (
  config: number,
  position: NotificationType | number,
  value: boolean
): number {
  let newConfig = config

  if (value) {
    newConfig |= 1 << position
  } else {
    newConfig &= ~(1 << position)
  }

  return newConfig
}
