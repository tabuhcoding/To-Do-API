import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/task.repository';
import { Ok, Err, Result } from 'oxide.ts';
import { GetTasksListResponseDto } from './getTaskList-response.dto';
import { GetTasksListQueryDto } from './getTaskList-query.dto';
import { IORedisService } from 'src/infrastructure/redis/ioredis.service';

@Injectable()
export class GetTasksListService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly redisService: IORedisService,
  ) {}

  async getTasksList(query: GetTasksListQueryDto): Promise<Result<GetTasksListResponseDto, Error>> {
    const redisClient = this.redisService.getClient();
    const cacheKey = `tasks:list:${JSON.stringify(query)}`;
    try {    
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return Ok(JSON.parse(cachedData));
      }
      const tasks = await this.tasksRepository.getTasks(query);
      await redisClient.set(cacheKey, JSON.stringify(tasks), 'EX', 24 * 60 * 60);
      return Ok(tasks);
    } catch (error) {
      return Err(new Error('Internal Server Error'));
    }
  }
}
