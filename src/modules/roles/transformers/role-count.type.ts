import { ApiProperty } from '@nestjs/swagger'

export class RoleCount {
  @ApiProperty({ type: Number, description: 'The count of the roles' })
  count: number
}
