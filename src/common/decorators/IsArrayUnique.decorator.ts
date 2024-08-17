import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
} from 'class-validator';

let l = 0;
let t:
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function';
let i = 0;

@ValidatorConstraint({
  name: 'IsArrayHasUniqueStringOrNumberConstraint',
  async: false,
})
class IsArrayHasUniqueStringOrNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(array: any[], args: ValidationArguments): boolean {
    if (!Array.isArray(array)) return false;
    l = array.length;
    const [allowedTypes, isNotEmpty] = args.constraints;
    if (isNotEmpty && !l) {
      return false;
    }
    const obj: {
      [k: string | number]: true;
    } = {};
    for (i = 0; i < l; ++i) {
      // type of the field
      t = typeof array[i];
      if (!allowedTypes.includes(t)) {
        return false;
      }
      if (obj[array[i]]) {
        return false;
      }
      obj[array[i]] = true;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const [allowedTypes, isNotEmpty] = args.constraints;
    if (!Array.isArray(args.object)) {
      return `The field ${args.property} should be an array.`;
    }
    if (isNotEmpty && !args.object.length) {
      return `The array field ${args.property} should not be empty.`;
    }
    return `The array field ${args.property} should not contain duplicate values and values should be of types ( ${args.constraints[0].join(', ')} ).`;
  }
}

type TAllowedTypes<
  T extends 'string' | 'number' = 'string' | 'number',
  L extends 1 | 2 = 2,
> = {
  length: L;
  0: T;
  1?: L extends 1 ? never : T extends 'string' ? 'number' : 'string';
};

export function IsArrayHasUniqueStringOrNumber<
  T extends 'string' | 'number' = 'string' | 'number',
  L extends 1 | 2 = 2,
>(
  options?: { allowedTypes?: TAllowedTypes<T, L>; isNotEmpty: boolean },
  validationOptions?: {
    message?: string;
  },
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Array should not contain duplicate values.',
        ...validationOptions,
      },
      constraints: [
        options?.allowedTypes || ['string', 'number'],
        options?.isNotEmpty || true,
      ],
      validator: IsArrayHasUniqueStringOrNumberConstraint,
    });
  };
}
