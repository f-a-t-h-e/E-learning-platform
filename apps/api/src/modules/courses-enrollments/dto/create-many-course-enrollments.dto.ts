import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { IsArrayHasUniqueStringOrNumber } from '../../../common/decorators/IsArrayUnique.decorator';

export class CreateManyCourseEnrollments {
  @ApiProperty({
    description:
      'The unique identifier of the course for which you want to enroll students.',
    example: 101,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  courseId: number;

  @ApiProperty({
    description: 'An array of student IDs to be enrolled in the course.',
    example: [102, 723, 1904],
  })
  @IsArrayHasUniqueStringOrNumber({
    isNotEmpty: true,
    allowedTypes: ['number'],
  })
  studentIds: number[];
}
