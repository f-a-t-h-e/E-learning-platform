import { ApiProperty } from '@nestjs/swagger';
import { ScheduledTaskDetailsBaseEntity } from './scheduled-task-details-base.entity';
import { Channels_Enum } from 'common/enums/channels.enum';
import { AVAILABLE_ROLES } from 'common/constants';

export class UserCreatedEventPayloadEntity {
  @ApiProperty({
    description: 'The user email address',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'mohammed1',
    uniqueItems: true,
    description: 'The username of the user profile. Must be unique.',
  })
  username: string;

  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the user profile.',
  })
  userId: number;

  @ApiProperty({
    description: 'The role of the user',
    enum: AVAILABLE_ROLES,
    example: 'student',
  })
  roleName: string;
}

export class UserCreatedEventEntity implements ScheduledTaskDetailsBaseEntity {
  @ApiProperty({
    description: `The channel name that the event will be emitted to.`,
    type: Channels_Enum.user_created,
  })
  channel: Channels_Enum.user_created;

  @ApiProperty({
    description: `The \`quizId\` of the quiz that needs to be reviewed`,
    type: UserCreatedEventPayloadEntity,
  })
  data: UserCreatedEventPayloadEntity;
}
