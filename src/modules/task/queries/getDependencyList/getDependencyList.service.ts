import { Injectable } from '@nestjs/common';
import { TaskDependencyRepository } from '../../repositories/taskDependency.repository';
import { Ok, Err, Result } from 'oxide.ts';

@Injectable()
export class GetDependencyListService {
  constructor(private readonly taskDependencyRepository: TaskDependencyRepository) {}

  async getTasksList(taskId: number): Promise<Result<any, Error>> {
    try {
      const tasks = await this.taskDependencyRepository.getAllDependencies(taskId);
      return Ok(tasks);
    } catch (error) {
      return Err(new Error('Internal Server Error'));
    }
  }
}
