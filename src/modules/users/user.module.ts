import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypesenseModule } from '../typesense/modules/typesense.module.js'
import { RoleRepository } from '../roles/repositories/role.repository.js'
import { CacheModule } from '../cache/cache.module.js'
import { RoleModule } from '../roles/role.module.js'
import { UserService } from './services/user.service.js'
import { User } from './entities/user.entity.js'
import { UserRepository } from './repositories/user.repository.js'
import { UserTypesenseRepository } from './repositories/user-typesense.repository.js'
import {
  ChangeUserNameController
} from './use-cases/change-user-name/change-user-name.controller.js'
import {
  ChangePasswordController
} from './use-cases/change-password/change-password.controller.js'
import { ViewUserController } from './use-cases/view-user/view-user.controller.js'
import { ViewUsersController } from './use-cases/view-users/view-users.controller.js'
import { RegisterUserController } from './use-cases/register-user/register-user.controller.js'
import { ChangeUserNameUseCase } from './use-cases/change-user-name/change-user-name.use-case.js'
import { ChangePasswordUseCase } from './use-cases/change-password/change-password.use-case.js'
import { ViewUsersUseCase } from './use-cases/view-users/view-users.use-case.js'
import { RegisterUserUseCase } from './use-cases/register-user/register-user.use-case.js'
import { ViewUserUseCase } from './use-cases/view-user/view-user.use-case.js'
import {
  ChangeUserRoleController
} from './use-cases/change-user-role/change-user-role.controller.js'
import { ChangeUserRoleUseCase } from './use-cases/change-user-role/change-user-role.use-case.js'
import { DeleteUserController } from './use-cases/delete-user/delete-user.controller.js'
import { DeleteUserUseCase } from './use-cases/delete-user/delete-user.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule,
    TypesenseModule,
    RoleModule
  ],
  controllers: [
    ChangeUserNameController,
    ChangePasswordController,
    ChangeUserRoleController,
    DeleteUserController,
    ViewUserController,
    ViewUsersController,
    RegisterUserController
  ],
  providers: [
    UserService,
    UserRepository,
    UserTypesenseRepository,
    RoleRepository,
    ChangeUserNameUseCase,
    ChangePasswordUseCase,
    ChangeUserRoleUseCase,
    DeleteUserUseCase,
    ViewUserUseCase,
    ViewUsersUseCase,
    RegisterUserUseCase
  ],
  exports: [UserService]
})
export class UserModule {}
