import { Injectable } from '@nestjs/common'
import { StringCodec } from 'nats'
import { NatsClient } from '../nats.client.js'
import { NatsTopics } from '../../websocket/topic.enum.js'

@Injectable()
export class ExamplePublisher {
  constructor (
    private readonly natsClient: NatsClient
  ) {}

  public publish (userUuid: string, notification: string): void {
    const sc = StringCodec()

    this.natsClient.publish(
      `${NatsTopics.EXAMPLE}.${userUuid}`,
      sc.encode(JSON.stringify(notification))
    )
  }
}
