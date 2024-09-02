import { ApiProperty } from '@nestjs/swagger'
import { NotFoundError } from 'rxjs'
import { Permission } from '../permission.enum.js'

export class PermissionObject {
  @ApiProperty()
  id: string

  @ApiProperty({ type: [String] })
  actions: string[]
}

export class PermissionTransformer {
  transformPermissionsToObject (input: string[]): PermissionObject[] {
    const permissionsMap: Record<string, string[]> = {}

    // Loop through the input array to group actions by ID
    for (const item of input) {
      const [id, action] = item.split('.')

      if (permissionsMap[id] === undefined) {
        permissionsMap[id] = []
      }
      if (action !== undefined) {
        permissionsMap[id].push(action)
      }
    }

    // Transform the permissions map into the desired format
    const permissions: PermissionObject[] = []

    for (const id of Object.keys(permissionsMap)) {
      permissions.push({
        id,
        actions: permissionsMap[id]
      })
    }

    // sort the permissions alphabetically
    permissions.sort((a, b) => a.id.localeCompare(b.id))

    return permissions
  }

  transformObjectToPermissions (input: PermissionObject[]): Permission[] {
    const permissions: Permission[] = []

    // Loop through the input array to transform the object into an array of permissions
    for (const item of input) {
      if (item.actions.length === 0) {
        const permission = item.id

        this.checkIfPermissionIsValid(permission)

        permissions.push(permission as Permission)
      } else {
        for (const action of item.actions) {
          const permission = `${item.id}.${action}`

          this.checkIfPermissionIsValid(permission)

          permissions.push(permission as Permission)
        }
      }
    }

    return permissions
  }

  private checkIfPermissionIsValid (permission: string): void {
    if (!(Object.values(Permission)).includes(permission as Permission)) {
      throw new NotFoundError(`Permission ${permission} not found`)
    }
  }
}
