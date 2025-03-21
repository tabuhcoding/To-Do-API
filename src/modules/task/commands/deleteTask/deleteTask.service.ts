import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/task.repository';
import { Ok, Err, Result } from 'oxide.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class DeleteTaskService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async deleteTask(id: number): Promise<Result<boolean, Error>> {
    try {
      if (!id || isNaN(id)) {
        return Err(new Error('Invalid task ID'));
      }

      const task = await this.tasksRepository.deleteTask(id);

      if (!task) {
        return Err(new Error('Task not found'));
      }

      return Ok(true);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return Err(new Error('Task not found'));
      }
      return Err(new Error(`Database Error: ${error.message}`));
    }
  }
}
