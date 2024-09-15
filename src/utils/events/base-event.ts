export enum EventVisibility {
  INTERNAL = 'internal',
  EXTERNAL = 'external'
}

export class BaseEvent<Content extends object = object> {
  constructor (
    public readonly topic: string,
    public readonly visibility: EventVisibility,
    public readonly data: Content
  ) {}

  serialize (): string {
    return JSON.stringify(this.data)
  }

  get isInternal (): boolean {
    return this.visibility === EventVisibility.INTERNAL
  }

  get isExternal (): boolean {
    return !this.isInternal
  }
}
