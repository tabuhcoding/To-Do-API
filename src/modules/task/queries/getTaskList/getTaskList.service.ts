import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/task.repository';
import { Ok, Err, Result } from 'oxide.ts';
import { GetTasksListResponseDto } from './getTaskList-response.dto';
import { GetTasksListQueryDto } from './getTaskList-query.dto';

@Injectable()
export class GetTasksListService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async getTasksList(query: GetTasksListQueryDto): Promise<Result<GetTasksListResponseDto, Error>> {
    try {
      const tasks = await this.tasksRepository.getTasks(query);
      return Ok(tasks);
    } catch (error) {
      return Err(new Error('Internal Server Error'));
    }
  }
}
