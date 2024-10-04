import { WiseEvent } from '../../../events/wise-event.js'
import { User } from '../../entities/user.entity.js'
import { EventVisibility } from '../../../events/event-visibility.enum.js'

export class UserRegisteredEventContent {
  public readonly userUuid: string
  public readonly userEmail: string

  constructor (user: User) {
    this.userUuid = user.uuid
    this.userEmail = user.email
  }
}

export class UserRegisteredEvent extends WiseEvent<UserRegisteredEventContent> {
  static VERSION = 1
  static TYPE = 'user.registered'

  constructor (user: User) {
    super({
      topic: UserRegisteredEvent.createTopic(user),
      version: UserRegisteredEvent.VERSION,
      content: new UserRegisteredEventContent(user),
      visibility: EventVisibility.EXTERNAL,
      type: UserRegisteredEvent.TYPE,
      source: 'api'
    })
  }

  private static createTopic (forUser: User): string {
    return `users.${forUser.uuid}.registered`
  }
}
