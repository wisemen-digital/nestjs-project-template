import { Injectable } from '@nestjs/common'
import type { User } from '../../users/entities/user.entity.js'
import { ScalewayMailClient } from '../clients/scaleway-mail.client.js'
import { MjmlRenderer } from '../renderer/mjml.renderer.js'
import { LocalizationService } from '../../localization/services/localization.service.js'
import type { ForgotPasswordMailContent } from '../content/forgot-password-mail.content.js'
import { PASSWORD_TOKEN_HOURS_VALID } from '../constants/password-reset.constant.js'

@Injectable()
export class MailService {
  constructor (
    private readonly mailClient: ScalewayMailClient,
    private readonly mjmlRenderer: MjmlRenderer,
    private readonly localizationService: LocalizationService
  ) {}

  async sendForgotPasswordMail (
    user: User,
    token: string,
    secret: string
  ): Promise<void> {
    const queryParams = new URLSearchParams({ token, secret })
    const deeplink = `${process.env.FRONTEND_URL}/reset-password?${queryParams.toString()}`

    const duration = this.localizationService.translate('common.duration.hours', { args: { count: PASSWORD_TOKEN_HOURS_VALID } })
    const content: ForgotPasswordMailContent = {
      heading: this.localizationService.translate('mail.password-reset.heading'),
      subject: this.localizationService.translate('mail.password-reset.subject'),
      body: {
        text: this.localizationService.translate('mail.password-reset.body.text'),
        subText: this.localizationService.translate('mail.password-reset.body.subText', { args: { duration } })
      },
      button: {
        text: this.localizationService.translate('mail.password-reset.button.text'),
        deeplink
      }
    }

    const html = await this.mjmlRenderer.render('forgot-password', content)

    await this.mailClient.sendMail({
      to: user.email,
      subject: content.subject,
      html
    })
  }
}
