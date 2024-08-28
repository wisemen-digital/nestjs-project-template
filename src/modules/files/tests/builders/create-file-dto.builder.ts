import { CreateFileDto } from '../../dtos/create-file.dto.js'
import { MimeType } from '../../enums/mime-type.enum.js'

export class CreateFileDtoBuilder {
  private dto: CreateFileDto

  constructor () {
    this.reset()
  }

  reset (): this {
    this.dto = new CreateFileDto()

    this.dto.name = 'test.png'
    this.dto.mimeType = MimeType.PNG

    return this
  }

  withFileName (name: string): this {
    this.dto.name = name

    return this
  }

  withMimeType (mimeType: MimeType): this {
    this.dto.mimeType = mimeType

    return this
  }

  build (): CreateFileDto {
    const result = this.dto

    this.reset()

    return result
  }
}
