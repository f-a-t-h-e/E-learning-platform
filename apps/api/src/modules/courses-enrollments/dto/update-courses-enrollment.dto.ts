import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';
import { IsArrayHasUniqueStringOrNumber } from '../../../common/decorators/IsArrayUnique.decorator';
import { ActionsEnum } from '../../../common/enums/actions.enum';

export class UpdateCourseEnrollments {
  @ApiProperty({
    description: `The unique identifier of the course for which you want to alter students' enrollments in.`,
    example: 101,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  courseId: number;

  @ApiProperty({
    description: 'An array of student IDs to be altered in the course.',
    example: [102, 723, 1904],
  })
  @IsArrayHasUniqueStringOrNumber({
    isNotEmpty: true,
    allowedTypes: ['number'],
  })
  studentIds: number[];

  @ApiProperty({
    description: 'The action to be performed.',
    enum: [ActionsEnum.DELETE],
    example: ActionsEnum.DELETE,
  })
  @IsEnum([ActionsEnum.DELETE])
  action: ActionsEnum.DELETE;
}
