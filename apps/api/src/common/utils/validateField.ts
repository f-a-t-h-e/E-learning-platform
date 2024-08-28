import { BadRequestException } from '@nestjs/common';

export const validateField = <
  T extends 'integer' | 'string',
  K extends string = string,
>(
  O: { [k in K | string]: any },
  fieldName: K | string,
  test: T,
) => {
  if (test == 'integer') {
    const val = parseInt(O[fieldName] || '');
    if (isNaN(val)) {
      throw new BadRequestException(`Invalid field "${fieldName}"`);
    }
    return val as T extends 'integer' ? number : string;
  }
  if (typeof O[fieldName] !== 'string') {
    throw new BadRequestException(`Invalid field "${fieldName}"`);
  }

  return O[fieldName] as T extends 'integer' ? number : string;
};
