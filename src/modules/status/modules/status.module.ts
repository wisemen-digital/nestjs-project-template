import { Module } from '@nestjs/common'
import { StatusController } from '../controllers/status.controller.js'

@Module({
  imports: [],
  controllers: [StatusController],
  providers: [],
  exports: []
})
export class StatusModule {}
