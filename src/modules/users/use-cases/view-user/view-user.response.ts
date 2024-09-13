import { ApiProperty } from '@nestjs/swagger'
import type { User } from '../../entities/user.entity.js'

export class ViewUserResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty({ type: String, format: 'email' })
  email: string

  @ApiProperty({ type: String, nullable: true, example: 'John' })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  lastName: string | null

  constructor (user: User) {
    this.uuid = user.uuid.toString()
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
  }
}
