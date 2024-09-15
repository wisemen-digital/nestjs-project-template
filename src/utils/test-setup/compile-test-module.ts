import { Test, type TestingModule } from '@nestjs/testing'
import { AppModule } from '../../app.module.js'

export async function compileTestModule (): Promise<TestingModule> {
  const imports = [AppModule.forRoot([], true)]

  return await Test.createTestingModule({ imports }).compile()
}
