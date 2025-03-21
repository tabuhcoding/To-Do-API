import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/task.repository';
import { UpdateTaskDto } from './updateTask.dto';
import { UpdateTaskResponseDto } from './updateTask-response.dto';
import { Ok, Err, Result } from 'oxide.ts';
import { IORedisService } from 'src/infrastructure/redis/ioredis.service';

@Injectable()
export class UpdateTaskService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly redisService: IORedisService,
  ) {}

  async updateTask(id: number, dto: UpdateTaskDto): Promise<Result<UpdateTaskResponseDto, Error>> {
    const redisClient = this.redisService.getClient();
    const cacheKeys = `tasks:list:*`;
    try {
      if (!id || isNaN(id)) {
        return Err(new Error('Invalid task ID'));
      }
      
      const task = await this.tasksRepository.updateTask(id, dto);
      if (!task) {
        return Err(new Error('Task not found or failed to update'));
      }

      const keys = await redisClient.keys(cacheKeys);
      for (const key of keys) {
        await redisClient.del(key);
      }

      return Ok(task);
    } catch (error) {
      return Err(new Error('Task not found.'));
    }
  }
}
