import { ApiProperty } from '@nestjs/swagger'
import { Transformer } from '@appwise/transformer'
import { Role, type User } from '../entities/user.entity.js'

export class UserPaginatedTransformerType {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  email: string

  @ApiProperty({ type: String, nullable: true })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true })
  lastName: string | null

  @ApiProperty({ enum: Role })
  role: Role
}

export class UserPaginatedTransformer
  extends Transformer<User, UserPaginatedTransformerType> {
  transform (user: User): UserPaginatedTransformerType {
    return {
      uuid: user.uuid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
  }
}
