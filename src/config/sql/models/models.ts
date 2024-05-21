import { Client } from '../../../modules/auth/entities/client.entity.js'
import { Pkce } from '../../../modules/auth/entities/pkce.entity.js'
import { RefreshToken } from '../../../modules/auth/entities/refreshtoken.entity.js'
import { FileLink } from '../../../modules/files/entities/file-link.entity.js'
import { File } from '../../../modules/files/entities/file.entity.js'
import { Role } from '../../../modules/roles/entities/role.entity.js'
import { User } from '../../../modules/users/entities/user.entity.js'

export const mainModels = {
  Client,
  Pkce,
  RefreshToken,
  Role,
  User,
  File,
  FileLink
}
