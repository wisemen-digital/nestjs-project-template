import { InitialMigration1639661527387 } from './1639661527387-InitialMigration.js'
import { ClientSeeder1643710646293 } from './1643710646293-ClientSeeder.js'
import { InitialNestMigration1704190107578 } from './1704190107578-InitialNestMigration.js'
import { UpdateUserRoles1707828496634 } from './1707828496634-UpdateUserRoles.js'
import { AddFiles1715334515089 } from './1715334515089-AddFiles.js'
import { AddDeletedAtColumnOnUser1723664868518 } from './1723664868518-AddDeletedAtColumnOnUser.js'
import { AddNatsOutboxEvent1727801404516 } from './1727801404516-AddNatsOutboxEvent.js'

export const mainMigrations = [
  InitialMigration1639661527387,
  ClientSeeder1643710646293,
  InitialNestMigration1704190107578,
  UpdateUserRoles1707828496634,
  AddFiles1715334515089,
  AddDeletedAtColumnOnUser1723664868518,
  AddNatsOutboxEvent1727801404516
]
