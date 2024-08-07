import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  title: string;

  @IsNumber()
  courseId: number;

  @IsOptional()
  @IsString()
  description?: string;
}
