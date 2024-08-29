import { Injectable } from '@nestjs/common'
import type { User } from '../../users/entities/user.entity.js'
import { ScalewayMailClient } from '../clients/scaleway-mail.client.js'
import { MjmlRenderer } from '../renderer/mjml.renderer.js'
import type { ForgotPasswordMailContent } from '../content/forgot-password-mail.content.js'
import { PASSWORD_TOKEN_HOURS_VALID } from '../constants/password-reset.constant.js'
import { translate } from '../../localization/helpers/translate.helper.js'

@Injectable()
export class MailService {
  constructor (
    private readonly mailClient: ScalewayMailClient,
    private readonly mjmlRenderer: MjmlRenderer
  ) {}

  async sendForgotPasswordMail (
    user: User,
    token: string,
    secret: string
  ): Promise<void> {
    const queryParams = new URLSearchParams({ token, secret })
    const deeplink = `${process.env.FRONTEND_URL}/reset-password?${queryParams.toString()}`

    const duration = translate('common.duration.hours', { args: { count: PASSWORD_TOKEN_HOURS_VALID } })
    const content: ForgotPasswordMailContent = {
      heading: translate('mail.password-reset.heading'),
      subject: translate('mail.password-reset.subject'),
      body: {
        text: translate('mail.password-reset.body.text'),
        subText: translate('mail.password-reset.body.subText', { args: { duration } })
      },
      button: {
        text: translate('mail.password-reset.button.text'),
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
