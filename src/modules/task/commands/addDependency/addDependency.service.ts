import { Injectable } from '@nestjs/common';
import { Ok, Err, Result } from 'oxide.ts';
import { AddDependencyResponseDto } from './addDependency-response.dto';
import { TaskDependencyRepository } from '../../repositories/taskDependency.repository';
import { IORedisService } from 'src/infrastructure/redis/ioredis.service';

@Injectable()
export class AddDependencyService {
  constructor(private readonly taskDependency: TaskDependencyRepository,
  private readonly redisService: IORedisService,
  ) {}

  async addDependency(taskId: number, dependOnTaskId: number): Promise<Result<AddDependencyResponseDto, Error>> {
    const redisClient = this.redisService.getClient();
    const cacheKey = `task:dependencies:*`;
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

      const keys = await redisClient.keys(cacheKey);
      for (const key of keys) {
        const keyValue = await redisClient.get(key);
        if (key.includes(taskId.toString()) || keyValue.includes(taskId.toString())) {
          await redisClient.del(key);
        }
      }
      return Ok(result.unwrap());
    }
    catch (error) {
      return Err(new Error('Error adding dependency.'));
    }
  }
}