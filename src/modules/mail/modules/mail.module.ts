import { Module } from '@nestjs/common'
import { MailService } from '../services/mail.service.js'
import { ScalewayMailClient } from '../clients/scaleway-mail.client.js'
import { HandlebarsClient } from '../clients/handlebars.client.js'

@Module({
  providers: [
    HandlebarsClient,
    ScalewayMailClient,
    MailService
  ],
  exports: [
    MailService
  ]
})
export class MailModule {}
