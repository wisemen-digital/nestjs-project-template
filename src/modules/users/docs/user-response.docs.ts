import { type ApiResponseOptions } from '@nestjs/swagger'
import { UserTransformerType } from '../transformers/user.transformer.js'

export const CREATE_USER_RESPONSE: ApiResponseOptions = {
  status: 201,
  description: 'The user has been successfully created.',
  type: UserTransformerType
}

export const GET_USER_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The user has been successfully received.',
  type: UserTransformerType
}

export const UPDATE_USER_RESPONSE: ApiResponseOptions = {
  status: 201,
  description: 'The user has been successfully updated.',
  type: UserTransformerType
}

export const DELETE_USER_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The user has been successfully deleted.'
}

export const UPDATE_USER_PASSWORD_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The user\'s password has been successfully updated.'
}
