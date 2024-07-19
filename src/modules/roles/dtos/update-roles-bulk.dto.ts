import { Type } from 'class-transformer'
import { IsNotEmpty, IsUUID, IsEnum, IsArray, ValidateNested } from 'class-validator'
import { Permission } from '../../permissions/enums/permission.enum.js'

class RoleValueDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string

  @IsNotEmpty()
  name: string

  @IsEnum(Permission, { each: true })
  @IsArray()
  permissions: Permission[]
}

export class UpdateRolesBulkDto {
  @ValidateNested({ each: true })
  @Type(() => RoleValueDto)
  @IsArray()
  @IsNotEmpty()
  roles: RoleValueDto[]
}
