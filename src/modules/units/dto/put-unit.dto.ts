import { IsOptional, IsString } from 'class-validator';

export class PutUnitDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
