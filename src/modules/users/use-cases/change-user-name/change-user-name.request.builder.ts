import { ChangeUserNameRequest } from './change-user-name.request.js'

export class ChangeUserNameRequestBuilder {
  private request: ChangeUserNameRequest

  constructor () {
    this.reset()
  }

  reset (): this {
    this.request = new ChangeUserNameRequest()
    this.request.firstName = 'John'
    this.request.lastName = 'Doe'
    return this
  }

  withFirstName (firstName: string): this {
    this.request.firstName = firstName
    return this
  }

  withLastName (lastName: string): this {
    this.request.lastName = lastName
    return this
  }

  build (): ChangeUserNameRequest {
    const result = this.request
    this.reset()
    return result
  }
}
