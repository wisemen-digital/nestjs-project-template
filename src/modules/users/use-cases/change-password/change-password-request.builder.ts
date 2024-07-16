import { ChangePasswordRequest } from './change-password.request.js'

export class ChangePasswordRequestBuilder {
  private request: ChangePasswordRequest

  constructor () {
    this.reset()
  }

  reset (): this {
    this.request = new ChangePasswordRequest()
    this.request.oldPassword = 'Password123'
    this.request.newPassword = 'Password1234'
    return this
  }

  withOldPasswordPassword (password: string): this {
    this.request.oldPassword = password
    return this
  }

  withNewPasswordPassword (password: string): this {
    this.request.newPassword = password
    return this
  }

  build (): ChangePasswordRequest {
    const result = this.request
    this.reset()
    return result
  }
}
