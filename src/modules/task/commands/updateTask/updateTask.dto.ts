import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Complete project report', description: 'Task title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Prepare the final project report for submission', description: 'Task description', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-04-01T12:00:00Z', description: 'Due date for the task', required: false })
  @IsString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ example: 'HIGH', enum: TaskPriority, description: 'Task priority', required: false })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ example: 'COMPLETE', enum: TaskStatus, description: 'Task status', required: false })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
