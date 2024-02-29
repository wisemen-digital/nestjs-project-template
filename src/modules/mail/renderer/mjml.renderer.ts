import { readFile } from 'fs/promises'
import { Injectable } from '@nestjs/common'
import mjml2html from 'mjml'
import { render, type Data } from 'ejs'

@Injectable()
export class MjmlRenderer {
  private readonly templateDir = process.cwd() + '/dist/src/modules/mail/templates/'

  public async render (templateName: string, data: Data): Promise<string> {
    const mjmlTemplateFile = await readFile(`${this.templateDir}${templateName}.mjml`, 'utf-8')
    const mjmlFile = render(mjmlTemplateFile, data)

    return mjml2html(mjmlFile).html
  }
}
