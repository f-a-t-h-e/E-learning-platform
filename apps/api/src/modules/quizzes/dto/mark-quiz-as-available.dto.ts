import { OmitType } from '@nestjs/swagger';
import { MarkAvailableDto } from 'apps/api/src/common/dto/markAvailable.dto';

export class MarkQuizAsAvailableDto extends OmitType(MarkAvailableDto, [
  'auto',
  'allStates',
]) {}
