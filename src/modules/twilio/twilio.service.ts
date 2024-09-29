import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import twilio, { Twilio } from 'twilio'

@Injectable()
export class TwilioService {
  private readonly client: Twilio

  constructor (
    private readonly configService: ConfigService
  ) {
    this.client = twilio(
      this.configService.getOrThrow<string>('TWILIO_ACCOUNT_SID'),
      this.configService.getOrThrow<string>('TWILIO_AUTH_TOKEN')
    )
  }

  public async createMessage (
    to: string,
    body: string
  ): Promise<void> {
    const from = this.configService.getOrThrow<string>('TWILIO_PHONE_NUMBER')

    const message = await this.client.messages.create({ from, to, body })

    console.log(message.sid)
  }

  public async createCall (
    to: string,
    body: string
  ): Promise<void> {
    const from = this.configService.getOrThrow<string>('TWILIO_PHONE_NUMBER')
    const call = await this.client.calls.create({
      from,
      to,
      twiml: `<Response><Say>${body}</Say></Response>`
    })

    console.log(call.sid)
  }
}
