import { type ApiResponseOptions } from '@nestjs/swagger'
import { UserTransformerType } from '../transformers/user.transformer.js'

export const createUserResponse: ApiResponseOptions = {
  status: 201,
  description: 'The user has been successfully created.',
  type: UserTransformerType
}

export const getUserResponse: ApiResponseOptions = {
  status: 200,
  description: 'The user has been successfully received.',
  type: UserTransformerType
}

export const updateUserResponse: ApiResponseOptions = {
  status: 201,
  description: 'The user has been successfully updated.',
  type: UserTransformerType
}

export const deleteUserResponse: ApiResponseOptions = {
  status: 200,
  description: 'The user has been successfully deleted.'
}

export const updateUserPasswordResponse: ApiResponseOptions = {
  status: 200,
  description: 'The user\'s password has been successfully updated.'
}
