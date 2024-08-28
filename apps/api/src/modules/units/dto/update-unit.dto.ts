import { PartialType } from '@nestjs/swagger';
import { PutUnitDto } from './put-unit.dto';

export class UpdateUnitDto extends PartialType(PutUnitDto) {}
