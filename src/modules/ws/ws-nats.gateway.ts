import { WebSocketGateway, SubscribeMessage, type OnGatewayConnection, type OnGatewayDisconnect, WebSocketServer, WsException, BaseWsExceptionFilter } from '@nestjs/websockets'
import { WebSocket, WebSocketServer as WSS } from 'ws'
import { type Subscription } from 'nats'
import { type ArgumentsHost, Catch, UsePipes, ValidationPipe, UseFilters, UnauthorizedException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { captureException } from '@sentry/node'
import { NatsClient } from '../nats/nats.client.js'
import { SubscribeDto } from './dtos/subscribe.dto.js'
import { UnsubscribeDto } from './dtos/unsubscribe.dto.js'

declare module 'ws' {
  interface WebSocket {
    uuid: string
  }
}

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch (exception: WsException, host: ArgumentsHost): void {
    (host.getArgByIndex(0)).send(JSON.stringify({
      error: exception instanceof UnauthorizedException ? exception.message : exception.getError(),
      data: host.getArgByIndex(1)
    }))
  }
}
@WebSocketGateway(3000, {
  wsEngine: 'ws',
  transports: ['websocket']
})
export class WSNatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly clients = new Map<string, WebSocket>()
  private readonly subscriptions = new Map<string, Map<string, Subscription>>()

  constructor (
    private readonly natsClient: NatsClient
  ) {}

  @WebSocketServer()
  server: WSS

  handleConnection (client: WebSocket, ..._args: never[]): void {
    client.uuid = uuidv4()

    this.clients.set(client.uuid, client)
    this.subscriptions.set(client.uuid, new Map<string, Subscription>())
  }

  handleDisconnect (client: WebSocket): void {
    const clientSubscriptions = this.subscriptions.get(client.uuid)

    clientSubscriptions?.forEach(clientSubscription => {
      clientSubscription.unsubscribe()
    })

    this.subscriptions.delete(client.uuid)
    this.clients.delete(client.uuid)
  }

  @UsePipes(new ValidationPipe({
    exceptionFactory (errors) {
      throw new WsException(errors)
    }
  }))
  @UseFilters(new WsExceptionFilter())
  @SubscribeMessage('subscribe')
  async handleSubscribe (client: WebSocket, payload: SubscribeDto): Promise<void> {
    const clientSubscriptions = this.subscriptions.get(client.uuid)

    if (
      clientSubscriptions == null ||
      clientSubscriptions.has(payload.topic)
    ) {
      return
    }

    const subscription = this.natsClient.subscribe(payload.topic)

    clientSubscriptions.set(payload.topic, subscription)

    for await (const msg of subscription) {
      try {
        client.send(msg.data.toString())
      } catch (e) {
        captureException(e)
      }
    }
  }

  // @UseGuards(AzureAdGuard)
  @UsePipes(new ValidationPipe())
  @SubscribeMessage('unsubscribe')
  handleUnsubscribe (client: WebSocket, payload: UnsubscribeDto): void {
    const clientSubscriptions = this.subscriptions.get(client.uuid)

    if (clientSubscriptions == null) {
      return
    }

    const subscription = clientSubscriptions.get(payload.topic)

    if (subscription != null) {
      subscription.unsubscribe()
      clientSubscriptions.delete(payload.topic)
    }
  }
}
