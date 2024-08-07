import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from '../controllers/user.controller.js'
import { UserService } from '../services/user.service.js'
import { User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { UserTypesenseRepository } from '../repositories/user-typesense.repository.js'
import { TypesenseModule } from '../../typesense/modules/typesense.module.js'
import { UserFlowService } from '../services/user-flow.service.js'
import { RoleRepository } from '../../roles/repositories/role.repository.js'
import { CacheModule } from '../../cache/cache.module.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule,
    TypesenseModule
  ],
  controllers: [UserController],
  providers: [
    UserFlowService,
    UserService,

    UserRepository,
    UserTypesenseRepository,

    RoleRepository
  ],
  exports: [UserService]
})
export class UserModule {}
