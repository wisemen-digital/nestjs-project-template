import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisCacheModule } from '../../utils/cache/cache.module.js'
import { TypesenseModule } from '../typesense/modules/typesense.module.js'
import { UserController } from './controllers/user.controller.js'
import { UserService } from './services/user.service.js'
import { User } from './entities/user.entity.js'
import { UserRepository } from './repositories/user.repository.js'
import { UserTypesenseRepository } from './repositories/user-typesense.repository.js'
import { UserFlowService } from './services/user-flow.service.js'
import { RegisterUserController } from './use-cases/register-user/register-user.controller.js'
import { RegisterUserUseCase } from './use-cases/register-user/register-user.use-case.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RedisCacheModule,
    TypesenseModule
  ],
  controllers: [UserController, RegisterUserController],
  providers: [
    UserService,
    UserRepository,
    UserTypesenseRepository,
    UserFlowService,
    RegisterUserUseCase
  ],
  exports: [UserService]
})
export class UserModule {}
