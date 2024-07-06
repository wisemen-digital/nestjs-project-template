import { Injectable } from '@nestjs/common'
import { StringCodec } from 'nats'
import { NatsClient } from '../../nats/nats.client.js'
import { Topic } from '../../websocket/topic.enum.js'

@Injectable()
export class NotificationPublisher {
  constructor (
    private readonly natsClient: NatsClient
  ) {}

  public async publish (userUuid: string, notification: string): Promise<void> {
    const sc = StringCodec()

    this.natsClient.publish(
      `${Topic.NOTIFICATION}.${userUuid}`,
      sc.encode(JSON.stringify(notification))
    )
  }
}
