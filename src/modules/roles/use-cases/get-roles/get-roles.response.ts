import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Permission } from '../../../permissions/permission.enum.js'
import { Role } from '../../entities/role.entity.js'

export class RoleResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty()
  name: string

  @ApiProperty({ enum: Permission, isArray: true })
  permissions: Permission[]
}

export class GetRolesResponse extends Transformer<Role, RoleResponse> {
  transform (role: Role): RoleResponse {
    return {
      uuid: role.uuid,
      name: role.name,
      permissions: role.permissions
    }
  }
}
