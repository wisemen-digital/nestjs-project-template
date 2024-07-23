import { Injectable } from '@nestjs/common'
import { StringCodec } from 'nats'
import { NatsClient } from '../clients/nats.client.js'
import { NatsTopics } from '../../websocket/topic.enum.js'

@Injectable()
export class ExamplePublisher {
  constructor (
    private readonly natsClient: NatsClient
  ) {}

  public async publish (userUuid: string, notification: string): Promise<void> {
    const sc = StringCodec()

    this.natsClient.publish(
      `${NatsTopics.EXAMPLE}.${userUuid}`,
      sc.encode(JSON.stringify(notification))
    )
  }
}
