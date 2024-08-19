import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ApiErrorResponses } from 'src/common/decorators/api-error-responses.decorator';
import JwtGuard from '../auth/guards/jwt.guard';
import { UserProfileEntity } from './entities/user-profile.entity';

@ApiTags('User Profile')
@ApiBearerAuth()
@ApiErrorResponses()
@UseGuards(JwtGuard)
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiParam({
    name: 'userId',
    description: 'Unique identifier of the user',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    type: UserProfileEntity,
  })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  getUserProfile(@Param('userId', ParseIntPipe) userId: number) {
    return this.userProfileService.getUserProfile(userId);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({
    name: 'userId',
    description: 'Unique identifier of the user',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
    type: UserProfileEntity,
  })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  updateUserProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userProfileService.updateUserProfile(
      userId,
      updateUserProfileDto,
    );
  }
}
