import { PartialType } from '@nestjs/mapped-types';
import { CreateMailingDto } from './create-mailing.dto';

export class UpdateMailingDto extends PartialType(CreateMailingDto) {
  id: number;
}
