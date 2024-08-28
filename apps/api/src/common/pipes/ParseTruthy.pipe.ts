import { Injectable, PipeTransform } from '@nestjs/common';
import { TRUTHY_STRING_VALUES } from '../constants';

@Injectable()
export class ParseTruthyPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    const normalizedValue = value?.toLowerCase();

    if (TRUTHY_STRING_VALUES.includes(normalizedValue as any)) {
      return true;
    }
    return false;
  }
}
