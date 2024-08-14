import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TypesenseModule } from '../typesense/modules/typesense.module.js'
import { RoleRepository } from '../roles/repositories/role.repository.js'
import { CacheModule } from '../cache/cache.module.js'
import { UserController } from './controllers/user.controller.js'
import { UserService } from './services/user.service.js'
import { User } from './entities/user.entity.js'
import { UserRepository } from './repositories/user.repository.js'
import { UserTypesenseRepository } from './repositories/user-typesense.repository.js'
import { UserFlowService } from './services/user-flow.service.js'
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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule,
    TypesenseModule
  ],
  controllers: [
    UserController,
    ChangeUserNameController,
    ChangePasswordController,
    ViewUserController,
    ViewUsersController,
    RegisterUserController
  ],
  providers: [
    UserFlowService,
    UserService,
    UserRepository,
    UserTypesenseRepository,
    RoleRepository,
    ChangeUserNameUseCase,
    ChangePasswordUseCase,
    ViewUserUseCase,
    ViewUsersUseCase,
    RegisterUserUseCase
  ],
  exports: [UserService]
})
export class UserModule {}
