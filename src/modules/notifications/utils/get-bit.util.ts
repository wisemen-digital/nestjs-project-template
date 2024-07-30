import { type NotificationType } from '../content/notification.type.js'

export function getBit (config: number, position: NotificationType): boolean
export function getBit (config: number, position: number): boolean
export function getBit (config: number, position: NotificationType | number): boolean {
  return ((config >> position) & 1) === 1
}
