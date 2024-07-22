import { ApiProperty } from '@nestjs/swagger'

export class RefreshGrantBody {
  @ApiProperty({ type: String, example: 'refresh' })
  grant_type: string

  @ApiProperty({ type: String })
  refresh_token: string

  @ApiProperty({ type: String })
  client_id: string

  @ApiProperty({ type: String })
  client_secret: string
}
