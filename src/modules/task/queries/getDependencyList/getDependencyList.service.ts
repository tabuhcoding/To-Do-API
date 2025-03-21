import { Injectable } from '@nestjs/common';
import { TaskDependencyRepository } from '../../repositories/taskDependency.repository';
import { Ok, Err, Result } from 'oxide.ts';
import { IORedisService } from 'src/infrastructure/redis/ioredis.service';

@Injectable()
export class GetDependencyListService {
  constructor(private readonly taskDependencyRepository: TaskDependencyRepository,
              private readonly redisService: IORedisService
  ) {}

  async getTasksList(taskId: number): Promise<Result<any, Error>> {
    const redisClient = this.redisService.getClient();
    const cacheKey = `task:dependencies:${taskId}`;
    this.logRedisData();
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log('📌 Fetching dependencies from cache');
        console.log(cachedData);
        return Ok(JSON.parse(cachedData));
      }

      const tasks = await this.taskDependencyRepository.getAllDependencies(taskId);

      await redisClient.set(cacheKey, JSON.stringify(tasks), 'EX', 24 * 60 * 60);
      console.log('✅ Dependencies cached');

      return Ok(tasks);
    } catch (error) {
      return Err(new Error('Internal Server Error'));
    }
  }
  async logRedisData() {
    const redis = this.redisService.getClient();
    const keys = await redis.keys('*'); // Lấy toàn bộ key trong Redis
    
    console.log('=== Redis Data ===');
    for (const key of keys) {
      const value = await redis.get(key);
      console.log(`Key: ${key}, Value: ${value}`);
    }
    console.log('==================');
  }
}
