import { after, before, describe, it } from 'node:test'
import type { INestApplication } from '@nestjs/common'
import dayjs from 'dayjs'
import { validate } from 'class-validator'
import { expect } from 'expect'
import { setupTest } from '../../test-setup/setup.js'
import { IsBeforeTodayString } from '../is-before-today.js'

class TestClass {
  @IsBeforeTodayString()
  date: string
}

describe('IsBeforeTodayString decorator', () => {
  let app: INestApplication

  before(async () => {
    ({ app } = await setupTest())
  })

  after(async () => {
    await app.close()
  })

  describe('IsBeforeTodayString decorator Test', () => {
    it('should pass validation when the date is before today', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(0)
    })

    it('should fail validation when the date is after today', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().add(1, 'day').format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })

    it('should fail validation when the date is the same as today', async () => {
      const testInstance = new TestClass()

      testInstance.date = dayjs().format('YYYY-MM-DD')

      const errors = await validate(testInstance)

      expect(errors.length).toBe(1)
    })
  })
})
