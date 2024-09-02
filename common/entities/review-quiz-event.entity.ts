import { Channels_Enum } from 'common/enums/channels.enum';
import { ScheduledTaskDetailsBaseEntity } from './scheduled-task-details-base.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewQuizEventEntity implements ScheduledTaskDetailsBaseEntity {
  @ApiProperty({
    description: `The channel name that the event will be emitted to.`,
    enum: Channels_Enum,
  })
  channel: Channels_Enum.review_quiz;

  @ApiProperty({
    description: `The \`quizId\` of the quiz that needs to be reviewed`,
    example: 1,
  })
  data: number;
}
