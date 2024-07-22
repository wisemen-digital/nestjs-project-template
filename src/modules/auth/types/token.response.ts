import { ApiProperty } from '@nestjs/swagger'

export class TokenResponse {
  @ApiProperty({ type: String, example: 'Bearer' })
  token_type: string

  @ApiProperty()
  access_token: string

  @ApiProperty({ type: Number, example: 3600 })
  expires_in: number

  @ApiProperty()
  refresh_token: string
}
