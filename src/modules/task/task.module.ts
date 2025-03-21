import { Delete, Module } from '@nestjs/common';
import { CreateTaskController } from './commands/createTask/createTask.controller';
import { CreateTaskService } from './commands/createTask/createTask.service';
import { TasksRepository } from './repositories/task.repository';
import { DeleteTaskController } from './commands/deleteTask/deleteTask.controller';
import { DeleteTaskService } from './commands/deleteTask/deleteTask.service';
import { UpdateTaskController } from './commands/updateTask/updateTask.controller';
import { UpdateTaskService } from './commands/updateTask/updateTask.service';

@Module({
  controllers: 
    [
      CreateTaskController,
      UpdateTaskController,
      DeleteTaskController,
    ],
  providers: 
    [
      CreateTaskService, 
      UpdateTaskService,
      DeleteTaskService,

      TasksRepository,
    ],
})
export class TaskModule {}