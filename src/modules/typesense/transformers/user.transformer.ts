import { Transformer } from '@appwise/transformer'
import type { User } from '../../users/entities/user.entity.js'
import type { Permission } from '../../permissions/permission.enum.js'

export class UserSearchTransformerType {
  id: string
  uuid: string
  firstName: string
  lastName: string
  permissions: Permission[]
}

export class UserSearchTransformer
  extends Transformer<User, UserSearchTransformerType> {
  transform (user: User): UserSearchTransformerType {
    return {
      id: user.uuid,
      uuid: user.uuid,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      permissions: user.role?.permissions ?? []
    }
  }
}
