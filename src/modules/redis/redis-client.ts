import type { RedisClientType } from 'redis'
import { createClient } from 'redis'

export const redisClient = createRedisClient(process.env.REDIS_URL)

redisClient.on('error', () => {
  // no error
})

export function createRedisClient (url?: string): RedisClientType {
  const client = createClient({
    url,
    pingInterval: 10000,
    socket: url?.startsWith('rediss') === true
      ? {
        tls: true,
        rejectUnauthorized: false
      }
      : undefined
  })

  return client
}
