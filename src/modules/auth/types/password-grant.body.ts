import { ApiProperty } from '@nestjs/swagger'

export class PasswordGrantBody {
  @ApiProperty({ type: String, example: 'password' })
  grant_type: string

  @ApiProperty()
  username: string

  @ApiProperty()
  password: string

  @ApiProperty()
  client_id: string

  @ApiProperty()
  client_secret: string
}
