import { Injectable } from '@nestjs/common'
import { WiseEvent } from '../../events/wise-event.js'
import { CloudEvent } from './cloud-event.js'

@Injectable()
export class NatsOutboxEventSerializer {
  serialize (event: WiseEvent): string {
    return JSON.stringify(this.mapToCloudEvent(event))
  }

  private mapToCloudEvent (event: WiseEvent): CloudEvent {
    return {
      id: event.id,
      contentType: 'application/json',
      specVersion: `v${event.version.toString()}`,
      time: event.createdAt.toISOString(),
      source: event.source,
      type: event.type,
      data: event.content
    }
  }
}
