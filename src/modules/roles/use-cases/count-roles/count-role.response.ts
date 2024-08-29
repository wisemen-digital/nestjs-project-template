import { ApiProperty } from '@nestjs/swagger'

export class CountRoleResponse {
  @ApiProperty({ type: Number, description: 'The count of the roles' })
  count: number
}
