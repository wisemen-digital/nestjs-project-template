import { Module } from '@nestjs/common'
import { PermissionController } from './controllers/permission.controller.js'

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [],
  exports: []
})
export class PermissionModule {}
