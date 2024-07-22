import type * as OAuth2Server from '@appwise/oauth2-server'
import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'

export class AuthTransformerType {
  @ApiProperty({ type: String, example: 'Bearer' })
  token_type: string

  @ApiProperty({ type: String })
  access_token: string

  @ApiProperty({ type: Number, example: 3600, required: false })
  expires_in?: number

  @ApiProperty({ type: String, required: false })
  refresh_token?: string
}

export class AuthTransformer extends Transformer<OAuth2Server.Token, AuthTransformerType> {
  transform (token: OAuth2Server.Token): AuthTransformerType {
    return {
      access_token: token.accessToken,
      token_type: 'Bearer',
      expires_in: (token.accessTokenExpiresAt != null)
        ? Math.floor((token.accessTokenExpiresAt.getTime() - Date.now()) / 1000)
        : undefined,
      refresh_token: token.refreshToken
    }
  }
}
