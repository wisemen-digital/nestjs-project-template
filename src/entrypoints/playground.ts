import { INestApplicationContext } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { JobContainer } from '@wisemen/app-container'
import { AppModule } from '../app.module.js'

export class Playground extends JobContainer {
  async bootstrap (): Promise<INestApplicationContext> {
    return await NestFactory.createApplicationContext(
      AppModule.forRoot([])
    )
  }

  async execute (_app: INestApplicationContext): Promise<void> {

  }
}

const _playground = new Playground()
