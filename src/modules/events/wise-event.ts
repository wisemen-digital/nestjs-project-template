import { v4 as generateUuid } from 'uuid'
import { EventVisibility } from './event-visibility.enum.js'

export class WiseEvent<Content extends object = object> {
  public readonly id: string
  public readonly topic: string
  public readonly createdAt: Date
  public readonly visibility: EventVisibility
  public readonly content: Content
  public readonly version: number
  public readonly source: string
  public readonly type: string

  constructor (options: {
    topic: string
    visibility: EventVisibility
    content: Content
    version: number
    source: string
    type: string
  }) {
    this.id = generateUuid()
    this.createdAt = new Date()
    this.topic = options.topic
    this.visibility = options.visibility
    this.content = options.content
    this.version = options.version
    this.source = options.source
    this.type = options.type
  }

  get isInternal (): boolean {
    return this.visibility === EventVisibility.INTERNAL
  }

  get isExternal (): boolean {
    return this.visibility === EventVisibility.EXTERNAL
  }
}
