import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UpdateUserRoleDto {
  @ApiProperty()
  @IsUUID()
  roleUuid: string
}
