import { CreateUserDto } from '../../../dtos/create-user.dto.js'

export class CreateUserDtoBuilder {
  private dto: CreateUserDto

  constructor () {
    this.reset()
  }

  reset (): this {
    this.dto = new CreateUserDto()

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

  build (): CreateUserDto {
    const result = this.dto

    this.reset()

    return result
  }
}
