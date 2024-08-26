import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOptionalId
  implements PipeTransform<string, number | undefined>
{
  transform(value: string, args): number | undefined {
    if (value) {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue)) {
        throw new BadRequestException(
          `Validation failed (numeric string is expected) for field (${args.data})`,
        );
      }
      if (parsedValue > 0) {
        return parsedValue
      }
      throw new BadRequestException(
        `Validation failed (greater than 1 is expected) for field (${args.data})`,
      );
    }
    return undefined;
  }
}
