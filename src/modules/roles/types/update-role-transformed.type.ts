import { type Permission } from '../../permissions/permission.enum.js'

export interface UpdateRoleTransformedType {
  uuid: string
  permissions: Permission[]
}
