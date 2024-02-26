import { Module } from '@nestjs/common'
import { MailService } from '../services/mail.service.js'
import { ScalewayMailClient } from '../clients/scaleway-mail.client.js'
import { MjmlRenderer } from '../renderer/mjml.renderer.js'

@Module({
  providers: [
    MjmlRenderer,
    ScalewayMailClient,
    MailService
  ],
  exports: [
    MailService
  ]
})
export class MailModule {}
