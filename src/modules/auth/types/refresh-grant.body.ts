import { ApiProperty } from '@nestjs/swagger'

export class RefreshGrantBody {
  @ApiProperty({ type: String, example: 'refresh' })
  grant_type: string

  @ApiProperty()
  refresh_token: string

  @ApiProperty()
  client_id: string

  @ApiProperty()
  client_secret: string
}
