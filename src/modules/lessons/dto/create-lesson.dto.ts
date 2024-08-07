import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsNumber()
  courseId: number;

  @IsNumber()
  unitId: number;

  @IsOptional()
  @IsString()
  description?: string;
}
