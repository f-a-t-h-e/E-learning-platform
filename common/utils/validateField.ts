import { BadRequestException } from '@nestjs/common';

interface validateField {
  <T extends 'integer' | 'string', K extends string>(
    O: { [k in K | string]: any },
    fieldName: K | string,
    test: T,
  ): T extends 'integer' ? number : string;
  <T extends 'enum', K extends string, EnumObj extends unknown>(
    O: { [k in K | string]: any },
    fieldName: K | string,
    test: T,
    enumObj: EnumObj,
  ): keyof EnumObj;
}

function testEnum(field: any, enumObj: any) {
  if (Object.prototype.hasOwnProperty.call(enumObj, field)) {
    return field;
  }
  throw new BadRequestException(
    `Invalid field "${field}" expected to be a value of the enum`,
  );
}

export const validateField = <
  T extends 'integer' | 'string' | 'enum',
  K extends string,
  EnumObj,
>(
  O: { [k in K | string]: any },
  fieldName: K | string,
  test: T,
  enumObj?: EnumObj,
): T extends 'integer'
  ? number
  : T extends 'string'
    ? string
    : T extends 'enum'
      ? keyof EnumObj
      : never => {
  type R = T extends 'integer'
    ? number
    : T extends 'string'
      ? string
      : T extends 'enum'
        ? keyof EnumObj
        : never;
  if (test == 'integer') {
    const val = parseInt(O[fieldName] || '');
    if (isNaN(val)) {
      throw new BadRequestException(`Invalid field "${fieldName}"`);
    }
    if (enumObj) {
      testEnum(val, enumObj);
    }
    return val as R;
  }
  if (test == 'enum') {
    testEnum(O[fieldName], enumObj);
    return O[fieldName] as R;
  }
  if (typeof O[fieldName] !== 'string') {
    throw new BadRequestException(`Invalid field "${fieldName}"`);
  }
  testEnum(O[fieldName], enumObj);

  return O[fieldName] as R;
};
