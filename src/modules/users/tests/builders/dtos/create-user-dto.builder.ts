import { CreateUserDto } from '../../../dtos/create-user.dto.js'

export class CreateUserDtoBuilder {
  private readonly dto: CreateUserDto = new CreateUserDto()

  constructor () {
    this.dto.email = 'test@mail.com'
    this.dto.password = 'Password123'
    this.dto.firstName = 'John'
    this.dto.lastName = 'Doe'
  }

  withEmail (email: string): CreateUserDtoBuilder {
    this.dto.email = email
    return this
  }

  withPassword (password: string): CreateUserDtoBuilder {
    this.dto.password = password
    return this
  }

  withFirstName (firstName: string): CreateUserDtoBuilder {
    this.dto.firstName = firstName
    return this
  }

  withLastName (lastName: string): CreateUserDtoBuilder {
    this.dto.lastName = lastName
    return this
  }

  build (): CreateUserDto {
    return this.dto
  }
}
