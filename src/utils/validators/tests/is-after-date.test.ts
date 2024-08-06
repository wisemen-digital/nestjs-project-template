import { after, before, describe, it } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { testSetup } from '../../test-setup/setup.js'
import { IsAfterDateString } from '../is-after-date.js'

class TestClass {
  @IsAfterDateString((obj: TestClass) => obj.referenceDate)
  date: string

  referenceDate: string
}

describe('IsAfterDateString decorator', async () => {
  let app: INestApplication

  before(async () => {
    ({ app } = await testSetup())
  })

  after(async () => {
    await app.close()
  })

  describe('IsAfterDateString decorator Test', () => {
    it('should pass validation when the date is after the reference date', async () => {
      const testInstance = new TestClass()
      testInstance.date = dayjs().add(1, 'day').format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)
      expect(errors.length).toBe(0)
    })

    it('should fail validation when the date is before the reference date', async () => {
      const testInstance = new TestClass()
      testInstance.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)
      expect(errors.length).toBe(1)
    })

    it('should fail validation when the date is the same as the reference date', async () => {
      const testInstance = new TestClass()
      testInstance.date = dayjs().format('YYYY-MM-DD')
      testInstance.referenceDate = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)
      expect(errors.length).toBe(1)
    })
  })
})
