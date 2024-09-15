import { BaseEvent } from '../../utils/events/base-event.js'

const TAP_TOPIC = '>'
const WILDCARD_TOPIC = '*'

type EventObserver = (event: BaseEvent) => Promise<void>

export class EventObservers {
  private readonly leafSubjectObservers: Map<string, EventObserver[]> = new Map()
  private readonly childTopicObservers: Map<string, EventObservers> = new Map()

  addObserver (onTopic: string, observer: EventObserver): void {
    const { subject, remainingTopic } = this.popSubject(onTopic)

    if (remainingTopic === null) {
      const leafSubjectObservers = this.leafSubjectObservers.get(subject) ?? []

      leafSubjectObservers.push(observer)
      this.leafSubjectObservers.set(subject, leafSubjectObservers)
    } else {
      const childTopicObservers = this.childTopicObservers.get(subject) ?? new EventObservers()

      childTopicObservers.addObserver(remainingTopic, observer)
      this.childTopicObservers.set(subject, childTopicObservers)
    }
  }

  getObservers (forTopic: string): EventObserver[] {
    const { subject, remainingTopic } = this.popSubject(forTopic)

    if (remainingTopic === null) {
      return [
        ...this.leafSubjectObservers.get(subject) ?? [],
        ...this.leafSubjectObservers.get(WILDCARD_TOPIC) ?? []
      ]
    } else {
      return [
        ...this.childTopicObservers.get(subject)?.getObservers(remainingTopic) ?? [],
        ...this.childTopicObservers.get(WILDCARD_TOPIC)?.getObservers(remainingTopic) ?? []
      ]
    }
  }

  popSubject (topic: string): { subject: string, remainingTopic: string | null } {
    if (topic === '') {
      throw new Error('Empty topic')
    }

    const hierarchyIndex = topic.indexOf('.')

    if (hierarchyIndex === -1) {
      return { subject: topic, remainingTopic: null }
    } else {
      const subject = topic.substring(0, hierarchyIndex)
      const remainingTopic = topic.substring(hierarchyIndex + 1)

      return { subject, remainingTopic }
    }
  }
}
