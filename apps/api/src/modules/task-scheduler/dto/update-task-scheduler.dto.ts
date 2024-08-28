import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskSchedulerDto } from './create-task-scheduler.dto';

export class UpdateTaskSchedulerDto extends PartialType(CreateTaskSchedulerDto) {
  id: number;
}
