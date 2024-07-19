import { type ApiResponseOptions } from '@nestjs/swagger'
import { UserTransformerType } from '../../users/transformers/user.transformer.js'

export const getUserInfoResponse: ApiResponseOptions = {
  status: 200,
  description: 'The user info has been successfully retrieved.',
  type: UserTransformerType
}
