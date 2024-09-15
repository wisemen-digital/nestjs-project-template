import { applyDecorators } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { BaseEvent } from '../../utils/events/base-event.js'
import { ALL_TOPICS } from './constants.js'

export function Subscribe (toTopic: string): MethodDecorator
export function Subscribe (toEvent: BaseEvent): MethodDecorator
export function Subscribe (toTopicOrEvent: string | BaseEvent): MethodDecorator {
  const topic = toTopicOrEvent instanceof BaseEvent ? toTopicOrEvent.topic : toTopicOrEvent

  return applyDecorators(OnEvent(topic, { suppressErrors: false }))
}

export function SubscribeToAll (): MethodDecorator {
  return applyDecorators(OnEvent(ALL_TOPICS, { suppressErrors: false }))
}
