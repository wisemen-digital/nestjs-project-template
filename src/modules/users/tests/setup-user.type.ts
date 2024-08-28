import type { Client } from '@appwise/oauth2-server'
import type { User } from '../entities/user.entity.js'

export interface SetupUser {
  user: User
  client: Client
  token: string
}
