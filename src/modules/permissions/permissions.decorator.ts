/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { SetMetadata } from '@nestjs/common'
import { type Permission } from './permission.enum.js'

export const PERMISSIONS_KEY = 'permissions'
export const Permissions = (...roles: Permission[]) => SetMetadata(PERMISSIONS_KEY, roles)

export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
