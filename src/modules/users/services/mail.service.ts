import { captureException } from '@sentry/node'
import { MailPaceHelper } from '../../../helpers/mailplace-client.js'
import { type ForgotPasswordContentType } from '../../../../templates/types/forgot-password.type.js'

export class MailService {
  async sendForgotPasswordMail (mailingContent: ForgotPasswordContentType): Promise<void> {
    try {
      const mailPlaceHelper = new MailPaceHelper()
      await mailPlaceHelper.sendEmailHandlebars({
        templateName: 'ForgotPassword',
        data: mailingContent.nl,
        subject: 'Wachtwoord vergeten?',
        sendTo: mailingContent.nl.footerSection.email
      })
    } catch (error) {
      captureException(error)
    }
  }
}
