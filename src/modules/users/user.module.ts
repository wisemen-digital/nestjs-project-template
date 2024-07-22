import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule } from '../cache/cache.module.js'
import { TypesenseModule } from '../typesense/typesense.module.js'
import { UserController } from './controllers/user.controller.js'
import { UserService } from './services/user.service.js'
import { User } from './entities/user.entity.js'
import { UserRepository } from './repositories/user.repository.js'
import { UserTypesenseRepository } from './repositories/user-typesense.repository.js'
import { UserFlowService } from './services/user-flow.service.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule,
    TypesenseModule
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserTypesenseRepository,
    UserFlowService
  ],
  exports: [UserService]
})
export class UserModule {}
