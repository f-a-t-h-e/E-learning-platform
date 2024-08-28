import { PartialType } from '@nestjs/swagger';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class UpdateUserProfileDto extends PartialType(CreateUserProfileDto) {}
