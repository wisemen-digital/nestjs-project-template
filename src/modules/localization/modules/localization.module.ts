import { join } from 'path'
import { Global, Module, type OnModuleInit } from '@nestjs/common'
import { AcceptLanguageResolver, I18nModule, I18nService } from 'nestjs-i18n'
import { ModuleRef } from '@nestjs/core'
import { DEFAULT_LANGUAGE } from '../constants/defaults.constant.js'
import { isLocalEnv } from '../../../utils/envs/env-checks.js'

@Global()
@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: DEFAULT_LANGUAGE,
        loaderOptions: {
          path: join(process.cwd(), '/dist/src/modules/localization/resources/'),
          watch: isLocalEnv()
        },
        typesOutputPath: join(process.cwd(), '/src/modules/localization/generated/i18n.generated.ts')
      }),
      resolvers: [
        AcceptLanguageResolver
      ]
    })
  ]
})
export class LocalizationModule implements OnModuleInit {
  private static i18nService: I18nService | undefined

  static default (): I18nService | undefined {
    return LocalizationModule.i18nService
  }

  constructor (
    private readonly moduleRef: ModuleRef
  ) { }

  onModuleInit (): void {
    LocalizationModule.i18nService = this.moduleRef.get(I18nService, { strict: false })
  }
}
