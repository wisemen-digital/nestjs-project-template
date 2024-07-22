import { type INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { initSentry } from '../../../helpers/sentry.js'
import { AppModule } from '../../../app.module.js'

export abstract class AbstractCronjob {
  protected app: INestApplicationContext

  async run (): Promise<void> {
    await this.init()
    await this.execute()
    await this.close()
  }

  private async init (): Promise<void> {
    initSentry()

    this.app = await NestFactory.createApplicationContext(
      AppModule.forRoot([])
    )

    this.app.enableShutdownHooks()

    await this.app.init()
  }

  protected abstract execute (): Promise<void>

  private async close (): Promise<void> {
    await this.app.close()
  }
}
