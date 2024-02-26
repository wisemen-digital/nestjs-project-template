import * as fs from 'fs'
import { Injectable } from '@nestjs/common'
import Handlebars from 'handlebars'

@Injectable()
export class HandlebarsClient {
  private readonly templateDir = './src/modules/mail/templates/'

  public renderHtml (templateName: string, context?: Record<string, unknown>): string {
    const templateFile = fs.readFileSync(`${this.templateDir}${templateName}.hbs`).toString()
    const template = Handlebars.compile(templateFile)
    return template(context)
  }
}
