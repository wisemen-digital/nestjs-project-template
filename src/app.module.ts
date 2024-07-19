import { type DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { AuthGuard } from './modules/auth/guards/auth.guard.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { PermissionsGuard } from './modules/permissions/guards/permissions.guard.js'
import { UserModule } from './modules/users/user.module.js'
import { mainMigrations } from './config/sql/migrations/index.js'
import { TypesenseModule } from './modules/typesense/typesense.module.js'
import { MailModule } from './modules/mail/mail.module.js'
import { RoleModule } from './modules/roles/role.module.js'
import { PermissionModule } from './modules/permissions/permissions.module.js'
import { RedisCacheModule } from './modules/cache/cache.module.js'
import configuration from './config/env/configuration.js'
import { StatusModule } from './modules/status/status.module.js'
import { FileModule } from './modules/files/file.module.js'
import { sslHelper } from './config/sql/utils/typeorm.js'
import { ErrorsInterceptor } from './utils/exceptions/errors.interceptor.js'
import { PgBossModule } from './modules/pgboss/modules/pgboss.module.js'
import { envValidationSchema } from './config/env/env.validation.js'

@Module({})
export class AppModule {
  static forRoot (
    modules: DynamicModule[] = []
  ): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.ENV_FILE,
          load: [configuration],
          validationSchema: envValidationSchema
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: process.env.DATABASE_URI,
          ssl: sslHelper(process.env.DATABASE_SSL),
          extra: { max: 50 },
          logging: false,
          synchronize: false,
          migrations: mainMigrations,
          migrationsRun: true,
          autoLoadEntities: true
        }),

        // Auth
        AuthModule,
        UserModule,
        RoleModule,
        PermissionModule,

        // PG Boss
        PgBossModule.forRoot(),

        // Utils
        MailModule,
        RedisCacheModule,
        TypesenseModule,
        FileModule,
        StatusModule,

        ...modules
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
    }
  }
}
