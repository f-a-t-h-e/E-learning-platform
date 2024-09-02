import { IsEnum, IsNotEmptyObject } from "class-validator";
import { Channels_Enum } from "../enums/channels.enum";

export class ScheduledTaskDetailsBaseEntity {
  @IsEnum(Channels_Enum)
  channel: Channels_Enum;

  /**
   * @todo Have a type that accepts the channel and returns the data structure
   */
  @IsNotEmptyObject()
  data: any;
}
