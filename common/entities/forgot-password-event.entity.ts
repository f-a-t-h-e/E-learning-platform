import { Channels_Enum } from 'common/enums/channels.enum';
import { ScheduledTaskDetailsBaseEntity } from './scheduled-task-details-base.entity';

export class ForgotPasswordEventEntity
  implements ScheduledTaskDetailsBaseEntity
{
  channel: Channels_Enum.forgot_password;
  data: ForgotPasswordEventDataEntity;
}

export class ForgotPasswordEventDataEntity {
  email: string;
  roleName: string;
  userId: number;
  username: string;
}
