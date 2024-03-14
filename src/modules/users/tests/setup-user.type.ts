import { type Client } from '@appwise/oauth2-server'
import { type User } from '@sentry/types'

export interface SetupUserType {
  user: User
  client: Client
  token: string
}
