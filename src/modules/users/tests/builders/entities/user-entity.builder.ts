import { randFirstName, randLastName, randUuid } from '@ngneat/falso'
import { User } from '../../../entities/user.entity.js'
import { type Role } from '../../../../roles/entities/role.entity.js'

export class UserEntityBuilder {
  private user: User

  constructor () {
    this.reset()
  }

  reset (): this {
    this.user = new User()

    this.user.uuid = randUuid()
    this.user.createdAt = new Date()
    this.user.updatedAt = new Date()
    this.user.email = 'test@mail.com'
    this.user.password = 'Password123'
    this.user.firstName = randFirstName()
    this.user.lastName = randLastName()
    this.user.roleUuid = null
    this.user.role = undefined

    return this
  }

  withUuid (uuid: string): this {
    this.user.uuid = uuid
    return this
  }

  withEmail (email: string): this {
    this.user.email = email
    return this
  }

  withPassword (password: string): this {
    this.user.password = password
    return this
  }

  withFirstName (firstName: string): this {
    this.user.firstName = firstName
    return this
  }

  withLastName (lastName: string): this {
    this.user.lastName = lastName
    return this
  }

  withRole (role: Role): this {
    this.user.roleUuid = role.uuid
    this.user.role = role
    return this
  }

  build (): User {
    const result = this.user

    this.reset()

    return result
  }
}
