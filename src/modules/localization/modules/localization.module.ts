import { join } from 'path'
import { Global, Module } from '@nestjs/common'
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n'
import { LocalizationService } from '../services/localization.service.js'
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
  ],
  providers: [
    LocalizationService
  ],
  exports: [
    LocalizationService
  ]
})
export class LocalizationModule { }
