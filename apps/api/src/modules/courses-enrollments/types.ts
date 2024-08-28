import { $Enums } from '@prisma/client';
import { FieldsOrNullFields } from '../../common/types/fieldsOrNullFields.type';

export type TGetStudentAuth = {
  courseState: $Enums.CourseState;
} & FieldsOrNullFields<{
  enrollmentState: $Enums.CourseEnrollmentState;
  courseEnrollmentId: number;
  endsAt: Date | null;
}>;
