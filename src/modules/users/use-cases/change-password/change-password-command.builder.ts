import { ChangePasswordCommand } from './change-password.command.js'

export class ChangePasswordCommandBuilder {
  private request: ChangePasswordCommand

  constructor () {
    this.reset()
  }

  reset (): this {
    this.request = new ChangePasswordCommand()
    this.request.oldPassword = 'Password123'
    this.request.newPassword = 'Password1234'
    return this
  }

  withOldPassword (password: string): this {
    this.request.oldPassword = password
    return this
  }

  withNewPassword (password: string): this {
    this.request.newPassword = password
    return this
  }

  build (): ChangePasswordCommand {
    const result = this.request
    this.reset()
    return result
  }
}
