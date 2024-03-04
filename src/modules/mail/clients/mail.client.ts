export interface SendMailOptions {
  to: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  from?: string
  subject: string
  text?: string
  html?: string
}

export interface MailClient {
  sendMail: (sendMailOptions: SendMailOptions) => Promise<void>
}
