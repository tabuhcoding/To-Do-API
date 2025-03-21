import { Injectable } from '@nestjs/common';
import { Ok, Err, Result } from 'oxide.ts';
import { AddDependencyResponseDto } from './addDependency-response.dto';
import { TaskDependencyRepository } from '../../repositories/taskDependency.repository';

@Injectable()
export class AddDependencyService {
  constructor(private readonly taskDependency: TaskDependencyRepository) {}

  async addDependency(taskId: number, dependOnTaskId: number): Promise<Result<AddDependencyResponseDto, Error>> {
    try{
      if (!taskId || isNaN(taskId) || !dependOnTaskId || isNaN(dependOnTaskId)) {
        return Err(new Error('Invalid task ID'));
      }

      const checkCircularDependencyDFS = await this.taskDependency.checkCircularDependencyDFS(taskId, dependOnTaskId);
      if(checkCircularDependencyDFS){
        return Err(new Error('Circular dependency detected.'));
      }

      const result = await this.taskDependency.createTaskDependency(taskId, dependOnTaskId);
      if (result.isErr()) {
        return Err(result.unwrapErr());
      }
      return Ok(result.unwrap());
    }
    catch (error) {
      return Err(new Error('Error adding dependency.'));
    }
  }
}