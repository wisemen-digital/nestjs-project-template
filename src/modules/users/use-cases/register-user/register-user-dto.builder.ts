import { RegisterUserDto } from './register-user.dto.js'

export class RegisterUserDtoBuilder {
  private dto: RegisterUserDto

  constructor () {
    this.reset()
  }

  reset (): this {
    this.dto = new RegisterUserDto()

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

  build (): RegisterUserDto {
    const result = this.dto

    this.reset()

    return result
  }
}
