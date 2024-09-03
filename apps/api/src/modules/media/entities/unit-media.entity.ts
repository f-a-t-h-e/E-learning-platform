import { ApiProperty } from '@nestjs/swagger';
import { $Enums, UnitMedia } from '@prisma/client';
import { MediaEntity } from './media.entity';

export class UnitMediaEntity extends MediaEntity implements UnitMedia {
  @ApiProperty({
    description: 'Unique identifier for the media',
    example: 1,
  })
  unitMediaId: number;

  @ApiProperty({
    description: 'Purpose of the media (e.g., unit_banner, unit_material)',
    example: 'unit_material',
    enum: $Enums.UnitMediaPurpose,
  })
  purpose: $Enums.UnitMediaPurpose;

  @ApiProperty({
    description: 'ID of the associated unit',
    example: 1,
  })
  unitId: number;
}
