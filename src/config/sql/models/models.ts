import { User } from '../../../modules/users/entities/user.entity.js'
import { Client } from '../../../modules/auth/entities/client.entity.js'
import { RefreshToken } from '../../../modules/auth/entities/refreshtoken.entity.js'
import { Pkce } from '../../../modules/auth/entities/pkce.entity.js'

export const mainModels = {
  Client,
  Pkce,
  RefreshToken,
  User
}
