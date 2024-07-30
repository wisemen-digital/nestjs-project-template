import { ApiProperty } from '@nestjs/swagger'

export class PasswordGrantBody {
  @ApiProperty({ type: String, example: 'password' })
  grant_type: string

  @ApiProperty({ type: String })
  username: string

  @ApiProperty({ type: String })
  password: string

  @ApiProperty({ type: String })
  client_id: string

  @ApiProperty({ type: String })
  client_secret: string
}
