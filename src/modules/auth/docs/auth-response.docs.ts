import { type ApiResponseOptions } from '@nestjs/swagger'
import { UserTransformerType } from '../../users/transformers/user.transformer.js'
import { AuthTransformerType } from '../transformers/auth.transformer.js'

export const getUserInfoResponse: ApiResponseOptions = {
  status: 200,
  description: 'The user info has been successfully retrieved.',
  type: UserTransformerType
}

export const createTokenResponse: ApiResponseOptions = {
  status: 200,
  description: 'The token has been successfully created.',
  type: AuthTransformerType
}
