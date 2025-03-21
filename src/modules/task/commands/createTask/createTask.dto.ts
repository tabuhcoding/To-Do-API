import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete project report', description: 'Task title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Prepare the final project report for submission', description: 'Task description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-04-01T12:00:00Z', description: 'Due date for the task' })
  @IsString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'MEDIUM', enum: TaskPriority, description: 'Task priority' })
  @IsEnum(TaskPriority)
  priority: TaskPriority;
}