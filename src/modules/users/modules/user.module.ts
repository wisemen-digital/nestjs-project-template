import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from '../controllers/user.controller.js'
import { UserService } from '../services/user.service.js'
import { User } from '../entities/user.entity.js'
import { UserRepository } from '../repositories/user.repository.js'
import { TypesenseModule } from '../../typesense/modules/typesense.module.js'
import { UserSubscriber } from '../subscribers/user.subscriber.js'

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypesenseModule],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserSubscriber
  ],
  exports: [UserService, TypesenseModule]
})
export class UserModule {}
