import { randUuid } from '@ngneat/falso'
import { User } from '../../../entities/user.entity.js'
import { type Role } from '../../../../roles/entities/role.entity.js'

export class UserEntityBuilder {
  private readonly user: User = new User()

  constructor () {
    this.user.uuid = randUuid()
    this.user.createdAt = new Date()
    this.user.updatedAt = new Date()
    this.user.email = 'test@mail.com'
    this.user.password = 'Password123'
    this.user.firstName = 'John'
    this.user.lastName = 'Doe'
  }

  withUuid (uuid: string): UserEntityBuilder {
    this.user.uuid = uuid
    return this
  }

  withEmail (email: string): UserEntityBuilder {
    this.user.email = email
    return this
  }

  withPassword (password: string): UserEntityBuilder {
    this.user.password = password
    return this
  }

  withFirstName (firstName: string): UserEntityBuilder {
    this.user.firstName = firstName
    return this
  }

  withLastName (lastName: string): UserEntityBuilder {
    this.user.lastName = lastName
    return this
  }

  withRole (role: Role): UserEntityBuilder {
    this.user.role = role
    return this
  }

  build (): User {
    return this.user
  }
}
