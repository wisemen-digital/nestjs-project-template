import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisCacheModule } from '../../common/cache/cache.module.js'
import { TypesenseModule } from '../typesense/modules/typesense.module.js'
import { UserController } from './controllers/user.controller.js'
import { UserService } from './services/user.service.js'
import { User } from './entities/user.entity.js'
import { UserRepository } from './repositories/user.repository.js'
import { UserTypesenseRepository } from './repositories/user-typesense.repository.js'
import { UserFlowService } from './services/user-flow.service.js'
import { RegisterUserController } from './use-cases/register-user/register-user.controller.js'
import { RegisterUserUseCase } from './use-cases/register-user/register-user.use-case.js'
import {
  ChangePasswordController
} from './use-cases/change-password/change-password.controller.js'
import { ChangePasswordUseCase } from './use-cases/change-password/change-password.use-case.js'
import { ViewUserController } from './use-cases/view-user/view-user.controller.js'
import { ViewUserUseCase } from './use-cases/view-user/view-user.use-case.js'
import { ChangeUserNameUseCase } from './use-cases/change-user-name/change-user-name.use-case.js'
import {
  ChangeUserNameController
} from './use-cases/change-user-name/change-user-name.controller.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisCacheModule,
    TypesenseModule
  ],
  controllers: [
    UserController,
    RegisterUserController,
    ChangePasswordController,
    ViewUserController,
    ChangeUserNameController
  ],
  providers: [
    UserService,
    UserRepository,
    UserTypesenseRepository,
    UserFlowService,
    RegisterUserUseCase,
    ChangePasswordUseCase,
    ViewUserUseCase,
    ChangeUserNameUseCase
  ],
  exports: [UserService]
})
export class UserModule {}
