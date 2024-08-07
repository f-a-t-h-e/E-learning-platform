import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PutLessonDto {
  @IsString()
  title: string;

  @IsNumber()
  unitId: number;

  @IsOptional()
  @IsString()
  description?: string;
}
