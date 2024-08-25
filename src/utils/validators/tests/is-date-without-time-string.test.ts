import { after, before, describe, it } from 'node:test'
import { type INestApplication } from '@nestjs/common'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { setupTest } from '../../test-setup/setup.js'
import { IsDateWithoutTimeString } from '../is-date-without-time-string.validator.js'

class TestClass {
  @IsDateWithoutTimeString()
  date: string
}

describe('IsDateWithoutTimeString decorator', async () => {
  let app: INestApplication

  before(async () => {
    ({ app } = await setupTest())
  })

  after(async () => {
    await app.close()
  })

  describe('IsDateWithoutTimeString decorator Test', () => {
    it('should pass validation when the date has no time', async () => {
      const testInstance = new TestClass()
      testInstance.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

      const errors = await validate(testInstance)
      expect(errors.length).toBe(0)
    })

    it('should fail validation when the date has a time', async () => {
      const testInstance = new TestClass()
      testInstance.date = dayjs().subtract(1, 'day').toISOString()

      const errors = await validate(testInstance)
      expect(errors.length).toBe(1)
    })
  })
})
