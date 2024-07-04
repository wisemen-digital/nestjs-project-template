import {
  type ValidationOptions,
  type ValidatorConstraintInterface, type ValidationArguments, registerDecorator
  ,
  ValidatorConstraint
} from 'class-validator'
import dayjs from 'dayjs'

export function IsSameOrBeforeDateString (
  dateCallback: (argObject: object) => string | undefined,
  format: string = 'YYYY-MM-DD',
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isSameOrBeforeDate',
      target: object.constructor,
      propertyName,
      constraints: [dateCallback, format],
      options: validationOptions,
      validator: IsSameOrBeforeDateStringValidator
    })
  }
}

export function isSameOrBeforeDateString (
  dateString: string | undefined,
  args: ValidationArguments
): boolean {
  if (typeof dateString !== 'string') return false

  if (args.constraints[0](args.object) == null) return true

  const dateToCheck = dayjs(dateString, 'YYYY-MM-DD')
  if (!dateToCheck.isValid()) return false

  const comparisonDateString = args.constraints[0](args.object)
  if (comparisonDateString === null) return true

  const comparisonDate = dayjs(comparisonDateString, 'YYYY-MM-DD')
  if (!comparisonDate.isValid()) return false

  return dateToCheck.isSame(comparisonDate, 'day') || dateToCheck.isBefore(comparisonDate, 'day')
}

@ValidatorConstraint({ name: 'isSameOrBeforeDateString', async: false })
class IsSameOrBeforeDateStringValidator implements ValidatorConstraintInterface {
  validate (date: string, args: ValidationArguments): boolean {
    return isSameOrBeforeDateString(date, args)
  }

  defaultMessage (args: ValidationArguments): string {
    const beforeString: string = args.constraints[0](args.object)
    return `${args.property} must be a date before or the same as ${beforeString}`
  }
}
