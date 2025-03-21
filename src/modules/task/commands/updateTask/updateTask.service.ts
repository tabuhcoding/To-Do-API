import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/task.repository';
import { UpdateTaskDto } from './updateTask.dto';
import { UpdateTaskResponseDto } from './updateTask-response.dto';
import { Ok, Err, Result } from 'oxide.ts';

@Injectable()
export class UpdateTaskService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async updateTask(id: number, dto: UpdateTaskDto): Promise<Result<UpdateTaskResponseDto, Error>> {
    try {
      if (!id || isNaN(id)) {
        return Err(new Error('Invalid task ID'));
      }
      
      const task = await this.tasksRepository.updateTask(id, dto);
      if (!task) {
        return Err(new Error('Task not found or failed to update'));
      }

      return Ok(task);
    } catch (error) {
      return Err(new Error('Task not found.'));
    }
  }
}
