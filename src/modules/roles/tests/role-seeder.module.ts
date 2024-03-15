import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleRepository } from '../repositories/role.repository.js'
import { Role } from '../entities/role.entity.js'
import { RoleSeeder } from './role.seeder.js'

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [],
  providers: [RoleRepository, RoleSeeder],
  exports: [RoleSeeder]
})
export class RoleSeederModule {}
