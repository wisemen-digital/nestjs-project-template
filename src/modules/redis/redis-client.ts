import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

export interface RedisExampleType {
  example: string
}

interface ChannelMessages {
  'example': RedisExampleType
}

type PublishFunction = <T extends keyof ChannelMessages>(
  channel: T,
  message: ChannelMessages[T]
) => Promise<number>

type SubscribeFunction = <T extends keyof ChannelMessages>(
  channel: T,
  listener: (message: ChannelMessages[T]) => void
) => Promise<void>

export interface TypedRedisClient extends Omit<RedisClientType, 'publish' | 'subscribe'> {
  publish: PublishFunction
  subscribe: SubscribeFunction
}

export const redisClient: TypedRedisClient = createRedisClient(process.env.REDIS_URL)

redisClient.on('error', () => {
  // no error
})

export function createRedisClient (url?: string): TypedRedisClient {
  const client = createClient({
    url,
    pingInterval: 10000,
    socket: url?.startsWith('rediss') === true
      ? {
        tls: true,
        rejectUnauthorized: false
      }
      : undefined
  }) as TypedRedisClient

  const originalPublish = client.publish.bind(client)
  const originalSubscribe = client.subscribe.bind(client)

  client.publish = async (channel, message) => {
    const serializedMessage = typeof message === 'object' ? JSON.stringify(message) : message
    return originalPublish(channel, serializedMessage)
  }

  client.subscribe = async (channel, listener) => {
    const wrappedListener = (message: string): void => {
      let parsedMessage
      try {
        parsedMessage = JSON.parse(message)
      } catch (e) {
        parsedMessage = message
      }
      listener(parsedMessage)
    }
    return originalSubscribe(channel, wrappedListener)
  }

  return client
}
