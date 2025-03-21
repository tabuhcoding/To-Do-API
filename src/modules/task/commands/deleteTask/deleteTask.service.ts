import { Injectable } from '@nestjs/common';
import { TasksRepository } from '../../repositories/task.repository';
import { Ok, Err, Result } from 'oxide.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { IORedisService } from 'src/infrastructure/redis/ioredis.service';

@Injectable()
export class DeleteTaskService {
  constructor(private readonly tasksRepository: TasksRepository,
    private readonly redisService: IORedisService,
  ) {}

  async deleteTask(id: number): Promise<Result<boolean, Error>> {
    const redisClient = this.redisService.getClient();
    const cacheKeys = `tasks:list:*`;
    try {
      if (!id || isNaN(id)) {
        return Err(new Error('Invalid task ID'));
      }

      const task = await this.tasksRepository.deleteTask(id);

      if (!task) {
        return Err(new Error('Task not found'));
      }

      const keys = await redisClient.keys(cacheKeys);
      for (const key of keys) {
        await redisClient.del(key);
      }

      return Ok(true);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return Err(new Error('Task not found'));
      }
      return Err(new Error(`Database Error: ${error.message}`));
    }
  }
}
