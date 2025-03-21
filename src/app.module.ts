// src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './modules/task/task.module';
import { PrismaModule } from './infrastructure/database/prisma/prisma.module';
import { IORedisModule } from './infrastructure/redis/ioredis.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService globally available
      envFilePath: '.env', // Path to .env file
    }),
    ConfigModule,
    PrismaModule,
    IORedisModule,
    TaskModule,

  ],
  providers: [
  ]
})

export class AppModule {}
