import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/task.repository';
import { CreateTaskDto } from './createTask.dto';
import { CreateTaskResponseDto } from './createTask-response.dto';
import { Ok, Err, Result } from 'oxide.ts';

@Injectable()
export class CreateTaskService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async createTask(dto: CreateTaskDto): Promise<Result<CreateTaskResponseDto, Error>>{
    try{
      const task = await this.tasksRepository.createTask(dto);
      if (!task) {
        return Err(new Error('Failed to create task.'));
      }
      return Ok(task);
    } catch (error) {
      return Err(new Error('Database Error.'));
    }
  }
}