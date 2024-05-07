import { type Client } from '@appwise/oauth2-server'
import { type User } from '@sentry/types'

export interface SetupUser {
  user: User
  client: Client
  token: string
}
