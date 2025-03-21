import { Delete, Module } from '@nestjs/common';
import { CreateTaskController } from './commands/createTask/createTask.controller';
import { CreateTaskService } from './commands/createTask/createTask.service';
import { TasksRepository } from './repositories/task.repository';
import { DeleteTaskController } from './commands/deleteTask/deleteTask.controller';
import { DeleteTaskService } from './commands/deleteTask/deleteTask.service';

@Module({
  controllers: 
    [
      CreateTaskController,
      DeleteTaskController,
    ],
  providers: 
    [
      CreateTaskService,
      DeleteTaskService,

      TasksRepository,
    ],
})
export class TaskModule {}