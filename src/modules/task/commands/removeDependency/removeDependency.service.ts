import { Injectable } from '@nestjs/common';
import { TaskDependencyRepository } from '../../repositories/taskDependency.repository';
import { Ok, Err, Result } from 'oxide.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IORedisService } from 'src/infrastructure/redis/ioredis.service';

@Injectable()
export class RemoveDependencyService {
  constructor(private readonly taskDependencyRepository: TaskDependencyRepository,
    private readonly redisService: IORedisService
  ) {}

  async removeDependency(taskId: number, dependOnTaskId: number): Promise<Result<boolean, Error>> {
    const redisClient = this.redisService.getClient();
    const cacheKeys = `task:dependencies:*`;
    try {
      if (!taskId || isNaN(taskId) || !dependOnTaskId || isNaN(dependOnTaskId)) {
        return Err(new Error('Invalid task ID'));
      }

      const taskDependency = await this.taskDependencyRepository.deleteTaskDependency(taskId, dependOnTaskId);

      if (taskDependency.isErr()) {
        return Err(taskDependency.unwrapErr());
      }

      const keys = await redisClient.keys(cacheKeys);
      for (const key of keys) {
        const keyValue = await redisClient.get(key);
        if (key.includes(taskId.toString()) || keyValue.includes(taskId.toString())) {
          await redisClient.del(key);
        }
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
