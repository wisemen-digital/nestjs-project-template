import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'
import { Permission } from '../../permissions/enums/permission.enum.js'
import { type Role } from '../entities/role.entity.js'

export class RoleTransformerType {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  name: string

  @ApiProperty({ enum: Permission, isArray: true })
  permissions: Permission[]
}

export class RoleTransformer extends Transformer<Role, RoleTransformerType> {
  protected transform (role: Role): RoleTransformerType {
    return {
      uuid: role.uuid,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      name: role.name,
      permissions: role.permissions
    }
  }
}
