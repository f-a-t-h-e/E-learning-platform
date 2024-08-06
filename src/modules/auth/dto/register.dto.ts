import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

const AVAILABLE_ROLES = ['student', 'teacher'] as const;

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @MinLength(3)
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsIn(AVAILABLE_ROLES)
  roleName: (typeof AVAILABLE_ROLES)[number];
}
