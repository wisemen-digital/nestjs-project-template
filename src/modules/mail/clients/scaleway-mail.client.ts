import { Injectable } from '@nestjs/common'
import axios, { type AxiosInstance } from 'axios'
import { type SendMailOptions, type MailClient } from './mail.client.js'
import { HandlebarsClient } from './handlebars.client.js'

@Injectable()
export class ScalewayMailClient implements MailClient {
  private readonly api: AxiosInstance
  private readonly region: string = process.env.SCW_REGION ?? 'fr-par'

  constructor (
    private readonly handlebarsClient: HandlebarsClient
  ) {
    this.api = axios.create({
      headers: {
        'X-Auth-Token': process.env.SCW_APIKEY
      }
    })
  }

  public async sendMail (options: SendMailOptions): Promise<void> {
    if (process.env.NODE_ENV === 'test') return

    const from = { email: options.from ?? process.env.MAIL_FROM_NAME }
    const to = options.to instanceof Array
      ? options.to.map(email => ({ email }))
      : [{ email: options.to }]
    const cc = options.cc instanceof Array
      ? options.cc.map(email => ({ email }))
      : (options.cc != null ? [{ email: options.cc }] : options.cc)
    const bcc = options.bcc instanceof Array
      ? options.bcc.map(email => ({ email }))
      : (options.bcc != null ? [{ email: options.bcc }] : options.bcc)

    const html = options.hbsTemplate != null
      ? this.handlebarsClient.renderHtml(options.hbsTemplate, options.hbsContext)
      : options.html

    const body = {
      from,
      to,
      cc,
      bcc,
      subject: options.subject,
      text: options.text,
      html,
      project_id: process.env.SCW_PROJECT_ID
    }

    await this.api.post(`https://api.scaleway.com/transactional-email/v1alpha1/regions/${this.region}/emails`, body)
  }
}
