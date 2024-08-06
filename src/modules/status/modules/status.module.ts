import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { StatusController } from '../controllers/status.controller.js'
import { RedisClient } from '../../redis/redis.client.js'
import { RedisHealthIndicator } from '../health/redis.health.js'
import { TypesenseClient } from '../../typesense/clients/typesense.client.js'
import { TypesenseHealthIndicator } from '../health/typesense.health.js'
import { AppStateService } from '../services/app-state.service.js'

@Module({
  imports: [TerminusModule],
  controllers: [StatusController],
  providers: [
    RedisClient,
    RedisHealthIndicator,
    TypesenseClient,
    TypesenseHealthIndicator,
    AppStateService
  ],
  exports: []
})
export class StatusModule {}
