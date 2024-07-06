import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator'
import { PermissionObject } from '../../permissions/transformers/permission.transformer.js'

export class RoleValueDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsUUID()
  uuid: string

  @ApiProperty({ type: PermissionObject, isArray: true })
  @IsArray()
  permissions: PermissionObject[]
}

export class UpdateRolesBulkDto {
  @ApiProperty({ type: [RoleValueDto] })
  @ValidateNested({ each: true })
  @Type(() => RoleValueDto)
  @IsArray()
  @IsNotEmpty()
  roles: RoleValueDto[]
}
