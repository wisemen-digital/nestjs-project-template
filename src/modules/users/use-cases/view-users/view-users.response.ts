import { ApiProperty } from '@nestjs/swagger'
import {
  PaginatedOffsetResponse
} from '../../../../utils/pagination/offset/paginated-offset.response.js'
import { UserSearchSchema } from '../../../typesense/collections/user.collections.js'

class UserIndexView {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty({ type: String, format: 'email' })
  email: string

  @ApiProperty({ type: String, nullable: true, example: 'John' })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  lastName: string | null

  constructor (user: UserSearchSchema) {
    this.uuid = user.uuid
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
  }
}

export class ViewUsersResponse extends PaginatedOffsetResponse<UserIndexView> {
  @ApiProperty({ type: UserIndexView, isArray: true })
  declare items: UserIndexView[]

  constructor (users: UserSearchSchema[], total: number, limit: number, offset: number) {
    const userViews = users.map(user => new UserIndexView(user))

    super(userViews, total, limit, offset)
  }
}
