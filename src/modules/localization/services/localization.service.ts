import { Injectable } from '@nestjs/common'
import { I18nService, type TranslateOptions } from 'nestjs-i18n'
import type { I18nPath, I18nTranslations } from '../generated/i18n.generated.js'

@Injectable()
export class LocalizationService {
  constructor (
    private readonly i18nService: I18nService<I18nTranslations>
  ) { }

  translate (key: I18nPath, options?: TranslateOptions): string {
    return this.i18nService.translate(key, options)
  }
}
