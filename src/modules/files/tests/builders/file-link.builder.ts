import { File } from '../../entities/file.entity.js'
import { MimeType } from '../../enums/mime-type.enum.js'

export class FileBuilder {
  private file: File

  constructor () {
    this.reset()
  }

  reset (): this {
    this.file = new File()

    this.file.name = 'test.png'
    this.file.mimeType = MimeType.PNG

    return this
  }

  withFileName (name: string): this {
    this.file.name = name

    return this
  }

  withMimeType (mimeType: MimeType): this {
    this.file.mimeType = mimeType

    return this
  }

  build (): File {
    const result = this.file

    this.reset()

    return result
  }
}
