import { Injectable } from '@nestjs/common'
import { type User } from '../../users/entities/user.entity.js'
import { ScalewayMailClient } from '../clients/scaleway-mail.client.js'

@Injectable()
export class MailService {
  constructor (
    private readonly mailClient: ScalewayMailClient
  ) {}

  async sendForgotPasswordMail (
    user: User,
    token: string,
    secret: string
  ): Promise<void> {
    const queryParams = new URLSearchParams({ token, secret })
    const name = `${user.firstName} ${user.lastName}`
    const url = `${process.env.FRONTEND_URL}/reset-password?${queryParams.toString()}`

    await this.mailClient.sendMail({
      to: user.email,
      subject: 'Reset password',
      hbsTemplate: 'forgot-password',
      hbsContext: {
        name,
        url
      }
    })
  }
}
