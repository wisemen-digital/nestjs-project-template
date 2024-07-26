import { type ApiResponseOptions } from '@nestjs/swagger'
import { UserTransformerType } from '../../users/transformers/user.transformer.js'
import { AuthTransformerType } from '../transformers/auth.transformer.js'

export const GET_USER_INFO_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The user info has been successfully retrieved.',
  type: UserTransformerType
}

export const CREATE_TOKEN_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The token has been successfully created.',
  type: AuthTransformerType
}
