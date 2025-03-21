import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { BaseResponse } from 'src/shared/response/base-response';

export class CreateTaskResponseDto {
  @ApiProperty({ example: 1, description: 'Task ID' })
  id: number;

  @ApiProperty({ example: 'Complete project report', description: 'Task title' })
  title: string;

  @ApiProperty({ example: 'Prepare the final project report for submission', description: 'Task description' })
  description: string;

  @ApiProperty({ example: '2025-04-01T12:00:00Z', description: 'Due date for the task' })
  dueDate: Date;

  @ApiProperty({ example: 'MEDIUM', enum: TaskPriority, description: 'Task priority' })
  priority: TaskPriority;

  @ApiProperty({ example: 'TODO', enum: TaskStatus, description: 'Task status' })
  status: TaskStatus;
}

export class CreateTaskResponse extends  BaseResponse {
  // @ApiProperty({ example: 201, description: 'HTTP status code' })
  // statusCode: number;

  // @ApiProperty({ example: 'Task created successfully', description: 'Success message' })
  // message: string;

  @ApiProperty({ type: CreateTaskResponseDto, description: 'Created task details' })
  task: CreateTaskResponseDto;
}