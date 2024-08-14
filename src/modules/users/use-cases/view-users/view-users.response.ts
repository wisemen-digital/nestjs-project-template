import { ApiProperty } from '@nestjs/swagger'
import {
  PaginatedOffsetResponse
} from '../../../../common/pagination/paginated-offset-response.js'
import type { User } from '../../entities/user.entity.js'

class UserIndexView {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty({ type: String, format: 'email' })
  email: string

  @ApiProperty({ type: String, nullable: true })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true })
  lastName: string | null

  constructor (user: User) {
    this.uuid = user.uuid.toString()
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
  }
}

export class ViewUsersResponse extends PaginatedOffsetResponse<UserIndexView> {
  @ApiProperty({
    type: UserIndexView
  })
  declare items: UserIndexView[]

  constructor (users: User[], total: number, limit: number, offset: number) {
    const userViews = users.map(user => new UserIndexView(user))
    super(userViews, total, limit, offset)
  }
}
