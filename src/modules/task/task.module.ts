import { Module } from '@nestjs/common';
import { CreateTaskController } from './commands/createTask/createTask.controller';
import { CreateTaskService } from './commands/createTask/createTask.service';
import { TasksRepository } from './repositories/task.repository';

@Module({
  controllers: 
    [
      CreateTaskController,
    ],
  providers: 
    [
      CreateTaskService,
      TasksRepository,
    ],
})
export class TaskModule {}