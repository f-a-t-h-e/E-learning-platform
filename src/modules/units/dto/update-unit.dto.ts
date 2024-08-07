import { PartialType } from '@nestjs/mapped-types';
import { PutUnitDto } from './put-unit.dto';

export class UpdateUnitDto extends PartialType(PutUnitDto) {}
