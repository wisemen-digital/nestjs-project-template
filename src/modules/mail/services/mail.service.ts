import { Injectable } from '@nestjs/common'
import { type User } from '../../users/entities/user.entity.js'
import { ScalewayMailClient } from '../clients/scaleway-mail.client.js'
import { ForgotPasswordTranslation } from '../translations/forgot-password.translation.js'
import { MjmlRenderer } from '../renderer/mjml.renderer.js'
import { mergeObjects } from '../../../utils/helpers/merge-objects.js'

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
    const html = await this.mjmlRenderer.render('forgot-password', mergeObjects(ForgotPasswordTranslation.nl, {
      button: {
        deeplink
      }
    }))

    await this.mailClient.sendMail({
      to: user.email,
      subject: ForgotPasswordTranslation.nl.subject,
      html
    })
  }
}
