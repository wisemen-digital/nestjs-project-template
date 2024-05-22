import {
  type ValidationOptions,
  type ValidatorConstraintInterface,
  type ValidationArguments,
  registerDecorator,
  ValidatorConstraint
} from 'class-validator'
import { Time } from '@appwise/time'

export function IsAfterTimeString (
  dateCallback: (argObject: object) => string,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAfterDate',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback],
      options: validationOptions,
      validator: IsAfterTimeStringValidator
    })
  }
}

export function isAfterTimeString (timeString: string, args: ValidationArguments): boolean {
  if (typeof timeString !== 'string') return false
  if (!/^\d{2}:\d{2}$/.test(timeString)) return false

  const comparisonTime = args.constraints[0](args.object)
  if (comparisonTime === null) return false
  if (!/^\d{2}:\d{2}$/.test(comparisonTime)) return false

  const currentTime = Time.fromString(`${timeString}:00`)
  const toCompare = Time.fromString(`${comparisonTime}:00`)

  return currentTime.isAfter(toCompare)
}

@ValidatorConstraint({ name: 'isAfterTimeString', async: false })
class IsAfterTimeStringValidator implements ValidatorConstraintInterface {
  validate (date: string, args: ValidationArguments): boolean {
    return isAfterTimeString(date, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const afterString: string = args.constraints[0](args.object)
    return `${args.property} must be a time string after ${afterString}`
  }
}
