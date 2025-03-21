import { Injectable } from '@nestjs/common';
import { TaskDependencyRepository } from '../../repositories/taskDependency.repository';
import { Ok, Err, Result } from 'oxide.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class RemoveDependencyService {
  constructor(private readonly taskDependencyRepository: TaskDependencyRepository) {}

  async removeDependency(taskId: number, dependOnTaskId: number): Promise<Result<boolean, Error>> {
    try {
      if (!taskId || isNaN(taskId) || !dependOnTaskId || isNaN(dependOnTaskId)) {
        return Err(new Error('Invalid task ID'));
      }

      const taskDependency = await this.taskDependencyRepository.deleteTaskDependency(taskId, dependOnTaskId);

      if (taskDependency.isErr()) {
        return Err(taskDependency.unwrapErr());
      }

      return Ok(true);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return Err(new Error('Dependency not found'));
      }
      return Err(new Error(`Database Error: ${error.message}`));
    }
  }
}
