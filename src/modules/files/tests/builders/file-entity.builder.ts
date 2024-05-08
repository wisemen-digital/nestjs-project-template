import { File } from '../../entities/file.entity.js'

export class FileBuilder {
  private file: File

  constructor () {
    this.reset()
  }

  reset (): this {
    this.file = new File()

    this.file.fileName = 'test.png'
    this.file.mimeType = 'image/png'

    return this
  }

  withFileName (fileName: string): this {
    this.file.fileName = fileName
    return this
  }

  withMimeType (mimeType: string): this {
    this.file.mimeType = mimeType
    return this
  }

  build (): File {
    const result = this.file

    this.reset()

    return result
  }
}
