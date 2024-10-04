import { applyDecorators } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ALL_TYPES } from './constants.js'

export function Subscribe (toType: string): MethodDecorator {
  return applyDecorators(OnEvent(toType, { suppressErrors: false }))
}

export function SubscribeToAll (): MethodDecorator {
  return applyDecorators(OnEvent(ALL_TYPES, { suppressErrors: false }))
}
