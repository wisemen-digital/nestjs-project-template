import { type ApiResponseOptions } from '@nestjs/swagger'
import { RoleTransformerType } from '../transformers/role.transformer.js'
import { RoleCountTransformerType } from '../transformers/role-count.transformer.js'

export const GET_ROLES_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The roles has been successfully received.',
  type: RoleTransformerType,
  isArray: true
}

export const CREATE_ROLE_RESPONSE: ApiResponseOptions = {
  status: 201,
  description: 'The role has been successfully created.',
  type: RoleTransformerType
}

export const UPDATE_ROLES_BULK_RESPONSE: ApiResponseOptions = {
  status: 201,
  description: 'The roles have been successfully updated.',
  type: RoleTransformerType,
  isArray: true
}

export const GET_ROLE_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The role has been successfully received.',
  type: RoleTransformerType
}

export const UPDATE_ROLE_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The role has been successfully updated.',
  type: RoleTransformerType
}

export const DELETE_ROLE_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The role has been successfully deleted.'
}

export const GET_ROLE_COUNT_RESPONSE: ApiResponseOptions = {
  status: 200,
  description: 'The role count has been successfully received.',
  type: RoleCountTransformerType
}
