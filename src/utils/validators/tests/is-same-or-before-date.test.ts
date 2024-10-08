import { before, describe, it } from 'node:test'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { NestExpressApplication } from '@nestjs/platform-express'
import { setupTest } from '../../test-setup/setup.js'
import { IsSameOrBeforeDateString } from '../is-same-or-before-date.js'

class TestClass {
  @IsSameOrBeforeDateString((obj: TestClass) => obj.referenceDate)
  date: string

  referenceDate: string
}

describe('IsSameOrBeforeDateString decorator', () => {
  let app: NestExpressApplication

  before(async () => {
    ({ app } = await setupTest())
  })

  before(async () => {
    await app.close()
  })

  describe('IsSameOrBeforeDateString decorator Test', () => {
    it('should pass validation when the date is before the reference date', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('should fail validation when the date is after the reference date', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().add(1, 'day').format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('should pass validation when the date is the same as the reference date', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })
  })
})
