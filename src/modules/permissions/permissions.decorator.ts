/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SetMetadata } from '@nestjs/common'
import { type Permission } from './permission.enum.js'

export const PERMISSIONS_KEY = 'permissions'
export function RequirePermission (permission: Permission) {
  return SetMetadata(PERMISSIONS_KEY, [permission])
}

export function RequirePermissions (...permissions: Permission[]) {
  return SetMetadata(PERMISSIONS_KEY, permissions)
}

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
