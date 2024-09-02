import { Channels_Enum } from 'common/enums/channels.enum';
import { ScheduledTaskDetailsBaseEntity } from './scheduled-task-details-base.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewQuizSubmissionEventEntity implements ScheduledTaskDetailsBaseEntity {
  @ApiProperty({
    description: `The channel name that the event will be emitted to.`,
    type: Channels_Enum.review_quiz_submission,
  })
  channel: Channels_Enum.review_quiz_submission;

  @ApiProperty({
    description: `The \`submissionId\` of the submission that needs to be reviewed`,
    example: 1,
  })
  data: number;
}
