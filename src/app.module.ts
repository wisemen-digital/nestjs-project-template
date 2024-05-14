import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { PGBossModule } from '@apricote/nest-pg-boss'
import { AuthGuard } from './modules/auth/guards/auth.guard.js'
import { AuthModule } from './modules/auth/modules/auth.module.js'
import { PermissionsGuard } from './modules/permissions/permissions.guard.js'
import { UserModule } from './modules/users/modules/user.module.js'
import { ErrorsInterceptor } from './errors.interceptor.js'
import { mainMigrations } from './config/sql/migrations/index.js'
import { TypesenseModule } from './modules/typesense/modules/typesense.module.js'
import { MailModule } from './modules/mail/modules/mail.module.js'
import { RoleModule } from './modules/roles/role.module.js'
import { PermissionModule } from './modules/permissions/permissions.module.js'
import { RedisCacheModule } from './utils/cache/cache.module.js'
import configuration from './config/env/configuration.js'
import { StatusModule } from './modules/status/modules/status.module.js'
import { sslHelper } from './config/sql/utils/typeorm.js'
import { Job } from './modules/jobs/entities/job.entity.js'
import { ArchivedJob } from './modules/jobs/entities/archived-job.entity.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE,
      load: [configuration]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.TYPEORM_URI,
      ssl: sslHelper(process.env.TYPEORM_SSL),
      extra: { max: 50 },
      logging: false,
      synchronize: false,
      migrations: mainMigrations,
      migrationsRun: true,
      autoLoadEntities: true
    }),
    PGBossModule.forRoot({
      connectionString: process.env.TYPEORM_URI,
      max: 10
    }),
    // Auth
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,

    // Jobs
    Job,
    ArchivedJob,

    // Utils
    MailModule,
    RedisCacheModule,
    TypesenseModule,
    StatusModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor
    }
  ]
})
export class AppModule {}
