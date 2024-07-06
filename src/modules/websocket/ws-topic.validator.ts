import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { WebSocket } from 'ws'
import { Topic } from './topic.enum.js'

@Injectable()
export class WsTopicValidator {
  validate (topic: string, client: WebSocket): void {
    if (topic.startsWith(Topic.NOTIFICATION)) {
      const userUuid = topic.split('.')[1]
      if (userUuid !== client.userUuid) {
        throw new UnauthorizedException()
      }
    }
  }
}
