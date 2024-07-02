import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from '../users/repositories/user.repository.js'
import { NatsModule } from '../nats/nats.module.js'
import { Role } from './entities/role.entity.js'
import { RoleController } from './controllers/role.controller.js'
import { RoleService } from './services/role.service.js'
import { RoleRepository } from './repositories/role.repository.js'

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    NatsModule.forFeature()
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, UserRepository],
  exports: [RoleService]
})
export class RoleModule {}
