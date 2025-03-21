import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IORedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  constructor(private readonly configService: ConfigService) {
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST') || 'localhost',
      port: parseInt(this.configService.get<string>('REDIS_PORT'), 10) || 6379,
      password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
    });

    this.redis.on('connect', () => console.log('✅ Connected to Redis'));
    this.redis.on('error', (err) => console.error('❌ Redis Error:', err));
  }

  async onModuleInit() {
    console.log('⚡ Redis Service initialized');
  }

  async onModuleDestroy() {
    await this.redis.quit();
    console.log('🔴 Redis connection closed');
  }

  getClient(): Redis {
    return this.redis;
  }
}
