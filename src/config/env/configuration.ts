import { type EnvConfiguration } from './env-configuration.type.js'

export default (): EnvConfiguration => ({
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  redisPort: parseInt(process.env.REDIS_PORT ?? '6379', 10)
})
