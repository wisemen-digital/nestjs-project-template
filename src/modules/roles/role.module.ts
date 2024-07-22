import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../users/repositories/user.repository.js'
import { CacheModule } from '../cache/cache.module.js'
import { TypesenseModule } from '../typesense/typesense.module.js'
import { Role } from './entities/role.entity.js'
import { RoleController } from './controllers/role.controller.js'
import { RoleService } from './services/role.service.js'
import { RoleRepository } from './repositories/role.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    CacheModule,
    TypesenseModule
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, UserRepository],
  exports: [RoleService]
})
export class RoleModule {}
