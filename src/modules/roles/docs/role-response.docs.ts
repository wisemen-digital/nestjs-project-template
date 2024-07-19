import { type ApiResponseOptions } from '@nestjs/swagger'
import { RoleTransformerType } from '../transformers/role.transformer.js'
import { RoleCountTransformerType } from '../transformers/role-count.transformer.js'

export const getRolesResponse: ApiResponseOptions = {
  status: 200,
  description: 'The roles has been successfully received.',
  type: RoleTransformerType,
  isArray: true
}

export const createRoleResponse: ApiResponseOptions = {
  status: 201,
  description: 'The role has been successfully created.',
  type: RoleTransformerType
}

export const updateRolesBulkResponse: ApiResponseOptions = {
  status: 201,
  description: 'The roles have been successfully updated.',
  type: RoleTransformerType,
  isArray: true
}

export const getRoleResponse: ApiResponseOptions = {
  status: 200,
  description: 'The role has been successfully received.',
  type: RoleTransformerType
}

export const updateRoleResponse: ApiResponseOptions = {
  status: 200,
  description: 'The role has been successfully updated.',
  type: RoleTransformerType
}

export const deleteRoleResponse: ApiResponseOptions = {
  status: 200,
  description: 'The role has been successfully deleted.'
}

export const getRoleCountResponse: ApiResponseOptions = {
  status: 200,
  description: 'The role count has been successfully received.',
  type: RoleCountTransformerType
}
