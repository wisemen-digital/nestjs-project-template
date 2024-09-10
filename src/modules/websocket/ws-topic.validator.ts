import { Injectable, UnauthorizedException } from '@nestjs/common'
import { getAuthOrFail } from '../auth/middleware/auth.middleware.js'
import { NatsTopics } from './topic.enum.js'

@Injectable()
export class WsTopicValidator {
  validate (topic: string): void {
    if (topic.startsWith(NatsTopics.EXAMPLE)) {
      const userUuid = topic.split('.')[1]

      const authenticatedUserUuid = getAuthOrFail().uuid

      if (userUuid !== authenticatedUserUuid) {
        throw new UnauthorizedException()
      }
    }
  }
}
