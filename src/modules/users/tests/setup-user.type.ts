import type { User } from '../entities/user.entity.js'

export interface TestUser {
  user: User
  token: string
}
