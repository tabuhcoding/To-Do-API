import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '@prisma/client';
import { BaseResponse } from 'src/shared/response/base-response';

export class UpdateTaskResponseDto {
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

  @ApiProperty({ example: 'IN_PROGRESS', enum: TaskStatus, description: 'Task status' })
  status: TaskStatus;
}

export class UpdateTaskResponse extends BaseResponse {
  @ApiProperty({ type: UpdateTaskResponseDto, description: 'Updated task details' })
  task: UpdateTaskResponseDto;
}
