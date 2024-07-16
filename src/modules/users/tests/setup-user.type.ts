import { type Client } from '@appwise/oauth2-server'
import { type User } from '@sentry/types'

export interface AuthorizedUser {
  user: User
  client: Client
  token: string
}
