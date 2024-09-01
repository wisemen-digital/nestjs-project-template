import { InitialMigration1639661527387 } from './1639661527387-InitialMigration.js'
import { UpdateUserRoles1707828496634 } from './1707828496634-UpdateUserRoles.js'
import { AddFiles1715334515089 } from './1715334515089-AddFiles.js'
import { AddDeletedAtColumnOnUser1723664868518 } from './1723664868518-AddDeletedAtColumnOnUser.js'
import { UpdateUser1725126923838 } from './1725126923838-UpdateUser.js'
import { AddSubOnUser1725196766171 } from './1725196766171-AddSubOnUser.js'

export const mainMigrations = [
  InitialMigration1639661527387,
  UpdateUserRoles1707828496634,
  AddFiles1715334515089,
  AddDeletedAtColumnOnUser1723664868518,
  UpdateUser1725126923838,
  AddSubOnUser1725196766171
]
