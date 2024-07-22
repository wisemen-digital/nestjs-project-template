import { type Permission } from '../../permissions/enums/permission.enum.js'

export interface UpdateRoleTransformedType {
  uuid: string
  permissions: Permission[]
}
