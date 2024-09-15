import { BaseEvent, EventVisibility } from '../../../../utils/events/base-event.js'
import { User } from '../../entities/user.entity.js'

export class UserRegisteredEventContent {
  public readonly userUuid: string
  public readonly userEmail: string

  constructor (user: User) {
    this.userUuid = user.uuid
    this.userEmail = user.email
  }
}

export class UserRegisteredEvent extends BaseEvent<UserRegisteredEventContent> {
  static TOPIC = 'user.registered'

  constructor (user: User) {
    super(
      UserRegisteredEvent.TOPIC,
      EventVisibility.EXTERNAL,
      new UserRegisteredEventContent(user)
    )
  }
}
