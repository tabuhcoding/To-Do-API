import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/task.repository';
import { CreateTaskDto } from './createTask.dto';
import { CreateTaskResponseDto } from './createTask-response.dto';
import { Ok, Err, Result } from 'oxide.ts';
import { IORedisService } from 'src/infrastructure/redis/ioredis.service';

@Injectable()
export class CreateTaskService {
  constructor(private readonly tasksRepository: TasksRepository,
  private readonly redisService: IORedisService,
  ) {}

  async createTask(dto: CreateTaskDto): Promise<Result<CreateTaskResponseDto, Error>>{
    const redisClient = this.redisService.getClient();
    const cacheKeys = `tasks:list:*`;
    try{
      const task = await this.tasksRepository.createTask(dto);
      if (!task) {
        return Err(new Error('Failed to create task.'));
      }

      const keys = await redisClient.keys(cacheKeys);
      for (const key of keys) {
        await redisClient.del(key);
      }
      return Ok(task);
    } catch (error) {
      return Err(new Error('Database Error.'));
    }
  }
}