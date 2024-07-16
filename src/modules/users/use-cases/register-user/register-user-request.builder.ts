import { RegisterUserRequest } from './register-user.request.js'

export class RegisterUserRequestBuilder {
  private dto: RegisterUserRequest

  constructor () {
    this.reset()
  }

  reset (): this {
    this.dto = new RegisterUserRequest()

    this.dto.email = 'test@mail.com'
    this.dto.password = 'Password123'
    this.dto.firstName = 'John'
    this.dto.lastName = 'Doe'

    return this
  }

  withEmail (email: string): this {
    this.dto.email = email
    return this
  }

  withPassword (password: string): this {
    this.dto.password = password
    return this
  }

  withFirstName (firstName: string): this {
    this.dto.firstName = firstName
    return this
  }

  withLastName (lastName: string): this {
    this.dto.lastName = lastName
    return this
  }

  build (): RegisterUserRequest {
    const result = this.dto

    this.reset()

    return result
  }
}
