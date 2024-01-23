import fs from 'fs/promises'
import path from 'path'
import { DomainClient } from '@mailpace/mailpace.js'
import { captureException } from '@sentry/node'
import hbs from 'handlebars'
import mjml2html from 'mjml'
import { type Message } from '@mailpace/mailpace.js/build/main/lib/models/Message.js'

export interface HandlebarsParams {
  templateName: string
  data: object
  sendTo: string | string[]
  subject: string
  replyTo?: string
}

export class MailPaceHelper {
  private readonly client: DomainClient

  constructor () {
    this.client = new DomainClient(process.env.MAILPACE_API_TOKEN as string)
  }

  private async createHtml (templateName: string, data: object): Promise<string> {
    const filePath = path.join(process.cwd(), 'templates/mjml/', `${templateName}.mjml`)

    const mjmlempty = await fs.readFile(filePath, 'utf8')

    const template = hbs.compile(mjmlempty)

    const mjml = template(data)

    const html = mjml2html(mjml)

    return html.html
  }

  public async sendEmailHandlebars (email: HandlebarsParams): Promise<void> {
    try {
      const htmlbody = await this.createHtml(email.templateName, email.data)

      const to = Array.isArray(email.sendTo) ? email.sendTo.join(', ') : email.sendTo

      const params: Message = {
        to,
        from: process.env.MAILPACE_SENDER as string,
        subject: email.subject,
        htmlbody
      }
      await this.client.sendEmail(params)
    } catch (e) {
      captureException(e)
    }
  }
}
