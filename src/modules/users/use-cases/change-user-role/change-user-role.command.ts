import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class ChangeUserRoleCommand {
  @ApiProperty()
  @IsUUID()
  roleUuid: string
}
