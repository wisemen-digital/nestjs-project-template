import { ChangeUserNameCommand } from './change-user-name.command.js'

export class ChangeUserNameCommandBuilder {
  private request: ChangeUserNameCommand

  constructor () {
    this.reset()
  }

  reset (): this {
    this.request = new ChangeUserNameCommand()
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

  build (): ChangeUserNameCommand {
    const result = this.request
    this.reset()
    return result
  }
}
