import { ApiProperty } from '@nestjs/swagger'

export class RoleCountType {
  @ApiProperty({ type: Number, description: 'The count of the roles' })
  count: number
}
