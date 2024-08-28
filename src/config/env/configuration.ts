import type { EnvConfiguration } from './env-configuration.type.js'

export default (): EnvConfiguration => ({
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379'
})
