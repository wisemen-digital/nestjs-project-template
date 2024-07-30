import { Module } from '@nestjs/common'
import { ScalewayMailClient } from './clients/scaleway-mail.client.js'
import { MjmlRenderer } from './renderer/mjml.renderer.js'
import { MailService } from './services/mail.service.js'

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
